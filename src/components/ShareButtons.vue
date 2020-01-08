<template>
  <social-sharing
    :title="title"
    :description="desc"
    :url="url"
    hashtags="live_torrent"
    twitter-user="fadi_davenchy"
    network-tag="a"
    inline-template
  >
    <div>
      <network network="facebook" class="blue--text text--darken-2 ma-3">
        <i class="fab fa-facebook"></i> Facebook
      </network>
      <network network="reddit" class="red--text text--lighten-1 ma-3">
        <i class="fab fa-reddit-alien"></i> Reddit
      </network>
      <network network="twitter" class="blue--text text--lighten-4 ma-3">
        <i class="fab fa-twitter"></i> Twitter
      </network>
      <network network="telegram" class="blue--text text--lighten-2 ma-3">
        <i class="fab fa-telegram"></i> Telegram
      </network>
      <network network="skype" class="blue--text ma-3">
        <i class="fab fa-skype"></i> Skype
      </network>
      <network network="sms" class="yellow--text ma-3">
        <i class="fas fa-sms"></i> SMS
      </network>
      <network network="email" class="orange--text ma-3">
        <i class="fas fa-envelope"></i> Email
      </network>
      <network network="vk" class="blue--text text--darken-3 ma-3">
        <i class="fab fa-vk"></i> VKontakte
      </network>
      <network network="weibo" class="red--text text--darken-1 ma-3">
        <i class="fab fa-weibo"></i> Weibo
      </network>
      <network network="whatsapp" class="green--text text--lighten-2 ma-3">
        <i class="fab fa-fw fa-whatsapp"></i> Whatsapp
      </network>
    </div>
  </social-sharing>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true
    },
    desc: {
      type: String,
      required: true
    },
    url: {
      type: String,
      default: window.location.href
    }
  }
};
</script>
