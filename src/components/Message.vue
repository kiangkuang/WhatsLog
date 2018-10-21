<template>
  <div
    class="message"
    :class="messageClass">
    <div v-if="message.type === 'admin'">
      {{ message.content }}
    </div>
    <div v-if="message.type !== 'admin'">
      <p
        class="from"
        :style="nameStyle"
        v-if="shouldShowName">
        {{ message.from }}
      </p>
      <span v-if="message.type === 'text'">{{ message.content }}</span>
      <img
        v-if="message.type === 'image'"
        :src="message.content">
      <video
        v-if="message.type === 'video'"
        controls>
        <source
          :src="message.content"
          type="video/mp4">
        Your browser does not support the video tag.
      </video>
      <span class="metadata">
        <span class="time">{{ message.time }}</span>
        <span
          class="tick"
          v-if="message.from === user">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="15"
            id="msg-dblcheck-ack"
            x="2063"
            y="2076">
            <path
              :d="svgPath"
              fill="#4fc3f7"/>
          </svg>
        </span>
      </span>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  props: {
    message: Object,
  },
  data: () => ({
    svgPath: 'M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.88a.32.32 0 0 1-.484.032l-.358-.325a.32.32 0 0 0-.484.032l-.378.48a.418.418 0 0 0 .036.54l1.32 1.267a.32.32 0 0 0 .484-.034l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.88a.32.32 0 0 1-.484.032L1.892 7.77a.366.366 0 0 0-.516.005l-.423.433a.364.364 0 0 0 .006.514l3.255 3.185a.32.32 0 0 0 .484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z',
  }),
  computed: {
    messageClass() {
      return {
        sent: this.message.type !== 'admin' && this.message.from === this.user,
        received: this.message.type !== 'admin' && this.message.from !== this.user,
        'admin-container': this.message.type === 'admin',
        'previous-user': this.message.isPreviousSender,
        media: ['image', 'video'].includes(this.message.type),
      };
    },
    nameStyle() {
      const hashCode = this.hashCode(this.message.from);
      const rgb = this.intToRGB(hashCode);
      return { color: `#${rgb}` };
    },
    shouldShowName() {
      return !this.message.isPreviousSender && this.message.from !== this.user;
    },
    ...mapState(['user']),
  },
  methods: {
    hashCode(str) {
      let hash = 0;
      for (let i = 0; i < str.length; i += 1) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
      }
      return hash;
    },
    intToRGB(i) {
      const c = (i & 0x00FFFFFF)
        .toString(16)
        .toUpperCase();

      return '00000'.substring(0, 6 - c.length) + c;
    },
  },
};
</script>

<style scoped>
.message.received, .message.sent, .message.admin-container div {
  color: #000;
  clear: both;
  line-height: 18px;
  font-size: 15px;
  padding: 8px;
  position: relative;
  margin-top: 8px;
  max-width: 85%;
  word-wrap: break-word;
  box-shadow: 0px 1px 1px 0px rgba(0,0,0,0.2);
}

.message:first-child {
  margin-top: 16px;
}

.message.received:after, .message.sent:after {
  position: absolute;
  content: "";
  width: 0;
  height: 0;
  border-style: solid;
}

.message.previous-user {
  margin-top: 2px;
}

.from {
  margin-bottom: 5px;
  font-size: 13px;
  font-weight: 600;
}

.metadata {
  display: block;
  float: right;
  padding: 0 0 0 7px;
  position: relative;
  bottom: -6px;
}

.metadata .time {
  color: rgba(0, 0, 0, .45);
  font-size: 11px;
  display: inline-block;
}

.metadata .tick {
  display: inline-block;
  margin-left: 2px;
  position: relative;
  height: 12px;
  width: 16px;
}

.metadata .tick svg {
  position: absolute;
  transition: .5s ease-in-out;
}

.metadata .tick svg:first-child {
  -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
  -webkit-transform: perspective(800px) rotateY(180deg);
          transform: perspective(800px) rotateY(180deg);
}

.metadata .tick svg:last-child {
  -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
  -webkit-transform: perspective(800px) rotateY(0deg);
          transform: perspective(800px) rotateY(0deg);
}

.metadata .tick-animation svg:first-child {
  -webkit-transform: perspective(800px) rotateY(0);
          transform: perspective(800px) rotateY(0);
}

.metadata .tick-animation svg:last-child {
  -webkit-transform: perspective(800px) rotateY(-179.9deg);
          transform: perspective(800px) rotateY(-179.9deg);
}

.message.admin-container {
  max-width: 100%;
  width: 100%;
  padding: 0;
  text-align: center;
  float: left;
}

.message.admin-container div {
  margin-left: auto;
  margin-right: auto;
  background: rgb(225,242,251);
  border-radius: 5px;
  max-width: 100%;
  display: inline-block;
}

.message.received {
  background: #fff;
  border-radius: 0px 5px 5px 5px;
  float: left;
}

.message.received .metadata {
  padding: 0 0 0 16px;
}

.message.received:after {
  border-width: 0px 10px 10px 0;
  border-color: transparent #fff transparent transparent;
  top: 0;
  left: -10px;
}

.message.sent {
  background: #e1ffc7;
  border-radius: 5px 0px 5px 5px;
  float: right;
}

.message.sent:after {
  border-width: 0px 0 10px 10px;
  border-color: transparent transparent transparent #e1ffc7;
  top: 0;
  right: -10px;
}

.message.received.previous-user, .message.sent.previous-user {
  border-radius: 5px;
}

.message.received.previous-user:after, .message.sent.previous-user:after {
  border: none;
}

.media {
  padding-bottom: 18px !important;
}

.media .metadata {
  position: absolute;
  bottom: 2px;
  right: 8px;
}

.media img {
  max-width: 100%;
}
</style>
