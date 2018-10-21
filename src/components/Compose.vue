<template>
  <div
    class="conversation-compose"
    @click="$refs.file.click()">
    <input
      type="file"
      v-show="false"
      ref="file"
      @change="onFilePicked"
      multiple>
    <div class="emoji">
      <v-icon>tag_faces</v-icon>
    </div>
    <input
      class="input-msg"
      name="input"
      placeholder="Select log and media files"
      readonly>
    <div class="photo">
      <v-icon>attach_file</v-icon>
    </div>
    <button class="send">
      <div class="circle">
        <v-icon dark>send</v-icon>
      </div>
    </button>

    <v-dialog
      v-model="dialog"
      max-width="290"
    >
      <v-card>
        <v-card-text>
          Please select exactly <strong>one</strong> .txt log file
        </v-card-text>

        <v-card-actions>
          <v-spacer/>
          <v-btn
            color="green darken-1"
            flat="flat"
            @click="dialog = false"
          >
            OK
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  data: () => ({
    dialog: false,
  }),
  methods: {
    async onFilePicked(e) {
      const files = Array.from(e.target.files);
      const logFiles = files.filter(file => file.type.match(/text.*/));
      const mediaFiles = files.filter(file => !file.type.match(/text.*/));

      if (logFiles.length !== 1) {
        e.target.value = null;
        this.dialog = true;
        return;
      }

      const media = await this.parseMedia(mediaFiles);

      this.setLogs({
        fileName: logFiles[0].name,
        messages: this.parseText(await this.readFile(logFiles[0]), media),
      });
    },
    readFile(file) {
      const fileReader = new FileReader();

      return new Promise((resolve, reject) => {
        fileReader.onload = () => {
          resolve(fileReader.result);
        };
        fileReader.onerror = () => {
          fileReader.abort();
          reject(new DOMException('Problem parsing input file.'));
        };

        if (file.type.match(/text.*/)) {
          fileReader.readAsText(file);
        } else {
          fileReader.readAsDataURL(file);
        }
      });
    },
    parseText(log, media) {
      const regex = /(\d{1,2}\/\d{1,2}\/\d{1,2}), (\d{1,2}:\d{1,2} (AM|PM)) - (.*): (.*)/gm;

      let previousFrom;
      const result = [];
      let match;
      match = regex.exec(log);
      while (match !== null) {
        if (match.index === regex.lastIndex) {
          regex.lastIndex += 1;
        }

        const [, /* date */, time, , from, content] = match;

        let type;
        if (content.endsWith('.jpg (file attached)') && media[content.slice(0, -16)]) {
          type = 'image';
        } else if (content.endsWith('.mp4 (file attached)') && media[content.slice(0, -16)]) {
          type = 'video';
        } else {
          type = 'text';
        }

        result.push({
          content: type === 'text' ? content : media[content.slice(0, -16)],
          from,
          isPreviousSender: from === previousFrom,
          time,
          type,
        });

        previousFrom = from;
        match = regex.exec(log);
      }
      return result;
    },
    async parseMedia(mediaFiles) {
      const mediaPromises = [];
      mediaFiles.forEach((mediaFile) => {
        mediaPromises.push(this.readFile(mediaFile));
      });
      const mediaResults = await Promise.all(mediaPromises);

      const mediaDictionary = {};
      for (let i = 0; i < mediaFiles.length; i += 1) {
        mediaDictionary[mediaFiles[i].name] = mediaResults[i];
      }
      return mediaDictionary;
    },
    ...mapActions([
      'setLogs',
    ]),
  },
};
</script>

<style scoped>
.conversation-compose {
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  overflow: hidden;
  height: 50px;
  width: 100%;
  z-index: 2;
  cursor: pointer;
}

.conversation-compose div,
.conversation-compose input {
  background: #fff;
  height: 100%;
  cursor: pointer;
}

.conversation-compose .emoji {
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 5px 0 0 5px;
  flex: 0 0 auto;
  margin-left: 8px;
  width: 48px;
}

.conversation-compose .input-msg {
  border: 0;
  flex: 1 1 auto;
  font-size: 16px;
  margin: 0;
  outline: none;
  min-width: 50px;
}

.conversation-compose .photo {
  flex: 0 0 auto;
  border-radius: 0 0 5px 0;
  text-align: center;
  position: relative;
  width: 48px;
}

.conversation-compose .photo:after {
  border-width: 0px 0 10px 10px;
  border-color: transparent transparent transparent #fff;
  border-style: solid;
  position: absolute;
  width: 0;
  height: 0;
  content: "";
  top: 0;
  right: -10px;
}

.conversation-compose .photo i {
  display: block;
  color: #7d8488;
  font-size: 24px;
  transform: translate(-50%, -50%) rotate(-45deg);
  position: relative;
  top: 50%;
  left: 50%;
}

.conversation-compose .send {
  background: transparent;
  border: 0;
  cursor: pointer;
  flex: 0 0 auto;
  margin-left: 8px;
  margin-right: 8px;
  padding: 0;
  position: relative;
  outline: none;
}

.conversation-compose .send .circle {
  background: #008a7c;
  border-radius: 50%;
  color: #fff;
  position: relative;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.conversation-compose .send .circle i {
  font-size: 24px;
  margin-left: 5px;
}
</style>
