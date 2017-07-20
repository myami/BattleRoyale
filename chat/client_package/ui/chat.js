window.Chat = Vue.component('chat', {
	data() {
		return {
			messageInput: '',
			visible: true,
			inputVisible: false,
			messages: [],
			history: [],
			historyPos: 0,
			maxMessageLength: 1024,
		};
	},
	mounted() {
		document.onkeyup = e => {
			const event = e || window.event;
			const code = (typeof event.which === 'number') ? event.which : event.keyCode;
			if (code === 27 && this.inputVisible) {
				setTimeout(() => this.setInputVisibility(false), 100);
				e.preventDefault();
			} else if (code === 116) {
			    this.visible = !this.visible;
			}
		};

		document.onkeypress = e => {
			const event = e || window.event;
			const code = (typeof event.which === 'number') ? event.which : event.keyCode;
			if (code === 9) {
				event.preventDefault();
				return;
			}

			if ((code === 84 || code === 116) && !this.inputVisible && !this.uiVisible) {
				this.setInputVisibility(true);
				e.preventDefault();
			
				setTimeout(() => document.getElementById('chat-input').focus(), 1);
			}

		};

		jcmp.AddEvent('window_focus', b => {
			if (this.inputVisible) {
				setTimeout(() => document.getElementById('chat-input').focus(), 1);
			}
		});

		jcmp.AddEvent('chat_settings', maxLength => {
			this.maxMessageLength = maxLength;
		});

		jcmp.AddEvent('chat_set_custom_css', css => {
			document.getElementById('custom-css').innerHTML = css;
		})

		jcmp.AddEvent('ui_state', s => {
			this.uiVisible = s;
		});

		jcmp.AddEvent('chat_message', (...args) => this.appendMessage(...args));

		document.onclick = () => {
			if (this.inputVisible && !this.inputLocked) {
				setTimeout(() => document.getElementById('chat-input').focus(), 1);
			}
		}

		jcmp.CallEvent('chat_ready');
	},
	watch: {
		visible(v) {
			if (!v) {
				this.setInputVisibility(false);
			}
		},
		uiVisible(v) {
			if (v) {
				this.visible = false;
			}
		},
		inputVisible(v) {
			// this event is needed to lock the player controls and is also used by the command-hints package.
			jcmp.CallEvent('chat_input_state', v);
			
    		if (v) {
				jcmp.ShowCursor();
			} else {
				jcmp.HideCursor();
			}
		},
	},
	methods: {
		setInputVisibility(v) {
			this.inputVisible = v;
		},
		submit() {
			const cleanup = () => {
				this.messageInput = '';
				this.setInputVisibility(false);
			};

			if (/^(\s{1,}|)$/.test(this.messageInput)) {
				return cleanup();
			}

			let msg = this.messageInput;
			const replace = (o, r) => msg = msg.replace(o, r);
			replace(/>/g, '&gt;');
			replace(/</g, '&lt;');

			this.historyPos = 0;
			if (this.history.length === 0 || (this.history.length > 0 && this.history[this.history.length - 1] !== msg)) {
				this.history.push(msg);	
			}

			cleanup();

			if (this.history.length > 50) {
				this.history.splice(0, 1);
			}

			console.debug('sending chat message');
			jcmp.CallEvent('chat_submit_message', msg);
		},
		appendMessage(text, r = 255, g = 255, b = 255) {
			console.debug('appending message');
			const obj = {
				text,
				color: `rgb(${r}, ${g}, ${b})`,
			};
			this.messages.push(obj);

			if (this.messages.length > 100) {
				this.messages.splice(0, 1);
			}

			// parse [#RRGGBB] tags
			let pos = obj.text.indexOf('[#');
			while (pos !== -1) {
				const start = pos;
				const end = pos + 8;

				if (obj.text.charAt(end) !== ']') {
					pos = obj.text.indexOf('[#', pos+1);
					continue;
				}

				const color = obj.text.substring(start + 1, end);
				let buf = obj.text.substr(0, start);
				buf += `</font><font style="color: ${color}">`;
				buf += obj.text.substr(end + 1, obj.text.length);

				obj.text = buf;
				pos = obj.text.indexOf('[#', end);
			}

			obj.text = obj.text.replace(/\n/g, '<br />');
			
			setTimeout(() => this.$el.children['chat-box'].scrollTop = this.$el.children['chat-box'].scrollHeight, 2);
		},
		navigateHistory(direction) {
			// negative direction: down
			// positive direction: up

			if (this.historyPos == 0 && direction) {
				return;
			} else if (this.historyPos > 0 && direction) {
				this.historyPos -= 1;
				if (this.historyPos === 0) {
					this.messageInput = '';
					return;
				}
			} else if (this.historyPos < this.history.length && !direction) {
				this.historyPos += 1;
			}
			this.messageInput = this.history[this.history.length - this.historyPos];
		}
	},
});