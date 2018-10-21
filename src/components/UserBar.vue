<template>
  <div class="user-bar">
    <div class="back">
      <v-icon dark>arrow_back</v-icon>
    </div>
    <div class="avatar">
      <img
        src="https://ui-avatars.com/api/?name=W+L"
        alt="Avatar">
    </div>
    <div class="name">
      <span>WhatsLog</span>
      <span class="status">{{ fileName }}</span>
    </div>
    <div class="actions more">
      <v-menu
        bottom
        left>
        <v-icon
          dark
          slot="activator">
          more_vert
        </v-icon>

        <v-list subheader>
          <v-subheader>Set Perspective</v-subheader>
          <v-list-tile
            v-for="(user, i) in users"
            :key="i"
            @click="setUser(user)"
          >
            <v-list-tile-title>
              {{ user }}
            </v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  computed: {
    users() {
      const users = this.messages
        .filter(message => message.type !== 'admin')
        .map(message => message.from);
      return [...new Set(users)];
    },
    ...mapState([
      'fileName',
      'messages',
    ]),
  },
  methods: {
    ...mapActions([
      'setUser',
    ]),
  },
};
</script>

<style scoped>
.user-bar {
  height: 55px;
  background: #005e54;
  color: #fff;
  padding: 0 8px;
  font-size: 24px;
  position: relative;
  z-index: 1;
  box-shadow: 0 -10px 10px 10px #000000;
}

.user-bar:after {
  content: "";
  display: table;
  clear: both;
}

.user-bar > div {
  float: left;
  transform: translateY(-50%);
  position: relative;
  top: 50%;
}

.user-bar .actions {
  float: right;
  margin: 0 0 0 20px;
}

.user-bar .actions.more {
  margin: -2px 12px 0 32px;
}

.user-bar .avatar {
  margin: 0 0 0 5px;
  width: 36px;
  height: 36px;
}

.user-bar .avatar img {
  border-radius: 50%;
  box-shadow: 0 1px 0 rgba(255, 255, 255, 0.1);
  display: block;
  width: 100%;
}

.user-bar .name {
  font-size: 17px;
  font-weight: 600;
  text-overflow: ellipsis;
  letter-spacing: 0.3px;
  margin: 0 0 0 8px;
  overflow: hidden;
  white-space: nowrap;
}

.user-bar .status {
  display: block;
  font-size: 13px;
  font-weight: 400;
  letter-spacing: 0;
}
</style>
