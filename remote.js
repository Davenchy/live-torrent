const uuid = require("uuid");
const groups = [];

/**
 * Event Names:
 *    load-info(ack) // returns socket information
 *    set-name(name, ack) // change device name
 *    create-group(groupName, groupPassword, ack) // create new group and be the manager
 *    set-groupPassword(id, newPassword, ack) // change group password [only the managers]
 *    connect-group(groupName, groupPassword, ack) // connect to a group for none manager sockets
 *    disconnect-group(id, ack) // leave group and if manager then set the next socket as manager
 *    ping-group(id, ack) // ping the group to check if it alive
 *    dispatch(id, payload, ack) // send payload to other sockets in the same group
 *    get-devices(id, ack) // get all devices in the same group
 *    kick-device(id, deviceId, ack) // kick device socket from the group [only fir managers]
 */

function onConnection(socket) {
  console.log("New Socket Connected!");
  socket.name = "Unknown Device";
  socket.isManager = false;
  socket.group = null;

  // set socket name
  socket.on("set-name", (name, ack = () => {}) => {
    socket.name = name;
    ack();
  });

  // send socket information
  socket.on("load-info", (ack = () => {}) => {
    let groupName = "";
    let isManager = false;
    let isKicked = false;
    let isTrusted = false;
    let groupId = "";
    let group = groups.find(g => g.id === socket.group);

    if (socket.group) {
      groupName = group.name;
      isManager = group.manager.id === socket.id;
      isKicked = group.kickedSockets.findIndex(s => s.id === socket.id) !== -1;
      isTrusted = isTrustedSocket(group, socket);
      groupId = group.id;
    }

    ack(false, {
      name: socket.name,
      groupName,
      isManager,
      isKicked,
      isTrusted,
      groupId
    });
  });

  // create new group for none group belonged sockets
  socket.on("create-group", (name, password, ack = () => {}) => {
    console.log("connect");
    // check if the group exists
    if (groups.find(g => g.name === name))
      return ack("Group with the same name already exists");
    // check if the socket is signed with another group
    if (socket.group) return ack("You are signed with another group");

    // create new group
    const id = uuid();

    groups.push({
      id,
      name,
      password,
      manager: socket,
      sockets: [socket],
      kickedSockets: []
    });

    socket.group = id;
    socket.isManager = true;

    ack(false, id);
  });

  // change the group password [only for managers]
  socket.on("set-groupPassword", (id, newPassword, ack = () => {}) => {
    // find the group
    const group = groups.find(g => g.id === id);
    if (!group) return ack("Group is not found");
    // check if the socket is the manager for the group
    if (group.manager.id !== socket.id)
      return ack("You are not the manager of this group");
    // change the password
    group.password = newPassword;
    ack();
  });

  // connect group for none group belonged sockets
  socket.on("connect-group", (name, password, ack = () => {}) => {
    // find the group
    const group = groups.find(g => g.name === name);
    if (!group) return ack("Group is not found");
    if (group.password !== password) return ack("Wrong Password!");
    // check if the socket is signed with another group
    if (socket.group) return ack("You are signed with another group");

    // check if the socket was kicked out
    if (isKicked(group, socket))
      return ack("You are kicked out from this group");
    // check if the user is already exist in the group
    if (isTrustedSocket(group, socket))
      ack("You are already signed with this group");

    // connect the socket to the group
    socket.group = group.id;
    socket.isManager = false;
    group.sockets.push(socket);
    ack(false, group.id);
  });

  // remove group only for manager sockets
  socket.on("disconnect-group", removeSocket(socket));

  // ping group for any socket
  socket.on("ping-group", (id, ack = () => {}) => {
    // find the group
    const group = groups.find(g => g.id === id);
    if (!group) return ack("Group is not found");
    // check if the socket was kicked out
    if (isKicked(group, socket))
      return ack("You are kicked out from this group");
    ack();
  });

  // send events between sockets
  socket.on("dispatch", (id, payload, ack = () => {}) => {
    // find the group
    const group = groups.find(g => g.id === id);
    if (!group) return ack("Group is not found");
    // check if the socket was kicked out
    if (isKicked(group, socket))
      return ack("You are kicked out from this group");
    // check if the user is already exist in the group
    if (!isTrustedSocket(group, socket))
      ack("You are not connected with that group");
    //send the payload to the other sockets in the group
    group.sockets.forEach(s => {
      if (s.id === socket.id) return;
      s.emit("dispatch", payload, data => ack(false, data));
    });
  });

  // get the other devices in the same group
  socket.on("get-devices", (id, ack = () => {}) => {
    // find the group
    const group = groups.find(g => g.id === id);
    if (!group) return ack("Group is not found");
    // check if the user is already exist in the group
    if (!isTrustedSocket(group, socket))
      ack("You are not connected with that group");
    // send devices information
    const devices = group.sockets.map(s => ({ name: s.name, id: s.id }));
    ack(false, devices);
  });

  // kick out socket from the group [only for managers]
  socket.on("kick-device", (id, deviceId, ack = () => {}) => {
    // find the group
    const group = groups.find(g => g.id === id);
    if (!group) return ack("Group is not found");
    // check if the socket is the manager
    if (group.manager.id !== socket.id)
      return ack("You are not the manager of this group");
    // check if the socket kicking itself out
    if (deviceId === socket.id) return ack("You can not kick out yourself");
    // find the socket to kick out
    const socketToKickIndex = group.sockets.findIndex(s => s.id === deviceId);
    if (socketToKickIndex === -1)
      return ack("Device with that id is not found");
    // kick out the socket
    const socketToKick = group.sockets[socketToKickIndex];
    group.sockets.splice(socketToKickIndex, 1);
    group.kickedSockets.push(socketToKick);
    ack();
  });

  // on socket disconnect
  socket.on("disconnect", function() {
    removeSocket(socket)(socket.group, () => {});
  });
}

function isTrustedSocket(group, socket) {
  const index = group.sockets.findIndex(s => s.id === socket.id);
  return index !== -1;
}

function isKicked(group, socket) {
  const socketIndex = group.kickedSockets.findIndex(s => s.id === socket.id);
  return socketIndex !== -1;
}

function removeSocket(socket) {
  return function(id, ack = () => {}) {
    // find the group
    const groupIndex = groups.findIndex(g => g.id === id);
    const group = groups[groupIndex];
    if (!group) return ack("Group with that name is not exist");

    // check if the user is already exist in the group
    if (!isTrustedSocket(group, socket))
      ack("You are not connected with that group");

    // remove socket form the group
    socket.isManager = false;
    socket.group = null;
    const i = group.sockets.findIndex(s => s.id === socket.id);
    if (i === -1) group.sockets.splice(i, 1);

    // if group is empty then remove it
    if (group.sockets.length === 0) {
      groups.splice(groupIndex, 1);
      return ack();
    }

    if (group.manager.id === socket.id) group.manager = group.sockets[0];
    ack();
  };
}

module.exports = io => io.on("connection", onConnection);
