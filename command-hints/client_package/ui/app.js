new Vue({
  el: '#app',
  data() {
    return {
      typing: false,
      buf: '',
      parameterBuf: '',
      currentParameter: null,
      
      commands: [],
      availableCommands: [],
      availableHints: [],

      hintRegex: new RegExp('COOKIES'),


      typingCommand: false,
      typingParams: false,
      switchToParam: false,
    };
  },
  mounted() {
    jcmp.AddEvent('chat_input_state', visible => {
      this.typing = visible;
      this.buf = '';
      this.parameterBuf = '';
      this.typingParams = false;
      this.typingCommand = false;
      this.switchToParam = false;
      this.currentParameter = null;
    });

    window.addEventListener('keydown', ev => {
      if (this.typing) {
        if (ev.keyCode === 8) {
          let isSpace = false;
          if (this.buf[this.buf.length - 1] === ' ') {
            isSpace = true;
          }
          this.buf = this.buf.slice(0, -1);
          if (this.buf.indexOf(' ') === -1 && isSpace) {
            this.typingParams = false;
            this.typingCommand = true;

            this.switchToParam = false;
          }
        }
      }
    })

    window.addEventListener('keypress', ev => {
      if (this.typing) {
        const char = String.fromCharCode(ev.charCode);
        this.buf += `${char}`;
        //console.log(this.buf);

        if (this.buf === '/') {
          this.typingCommand = true;
          this.switchToParam = false;
        } else if (char === ' ') {
          this.typingCommand = false;
          this.typingParams = true;

          setTimeout(() => {
            this.switchToParam = true;
          }, 150);
        }
      }
    });

    jcmp.AddEvent('CommandList', cmds => {
      this.commands = JSON.parse(cmds);
      this.commands.forEach(cmd => {
        cmd.lessUsage = cmd.usage.replace(/.*Parameters<\/h3>/g, '<h3>Parameters</h3>');
      });
    });

    jcmp.CallEvent('RequestCommands');
  },
  watch: {
    buf(s, old) {
      if (this.typingCommand) {
        this.availableCommands = this.commands.filter(cmd =>  ('/' + cmd.trigger).startsWith(s));
      }
      if (this.typingParams && this.availableCommands.length === 1) {
        const char = s.charAt(s.length - 1);
        const spaceCount = (s.match(/\s/g) || []).length;
        const cmd = this.availableCommands[0];
        const writing = s.length > old.length;
        
        // no spaces = not writing params
        // >0 spaces, writing => appending to buf, space only if it is a text parameter
        if (spaceCount === 0) {
          //console.log('spaceCount 0');
          this.currentParameter = null;
          this.parameterBuf = '';
        } else if (spaceCount > 0 && writing && char === ' ' && this.currentParameter && this.currentParameter.options.isTextParameter) {
          //console.log('textCommand add space');
          this.parameterBuf += ' ';
        } else if (spaceCount > 0 && char === ' ') {
          //console.log('spaceCount > 0 and Space, setting currentParameter');
          if (cmd.parameters.length < spaceCount) {
            console.warn('invalid spaceCount vs parameter length');
            return;
          }
          this.parameterBuf = '';
          this.currentParameter = cmd.parameters[spaceCount - 1];
          //console.log(this.currentParameter.options.hints);
          this.availableHints = this.currentParameter.options.hints || [];
          return;
        } else if (writing) {
          this.parameterBuf += char;
        }
        this.hintRegex = new RegExp(`(${this.parameterBuf})`, 'ig');

        if (this.currentParameter && typeof this.currentParameter.options.hints !== 'undefined') {
          this.availableHints = this.currentParameter.options.hints.filter(sub => sub.match(this.hintRegex));
        } else {
          this.availableHints = [];
        }
      }
    }
  }
});
