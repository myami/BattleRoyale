'use strict';

module.exports = function({ Command, manager }) {
  manager.category('other', 'various commands')
    .add(new Command('test')
      .description('this commands does nothing.')
      .handler(player => {
        mode.chat.send(player, 'as I told you, nothing.');
      }))

    // note that there was no semicolon in the last line, so the manager.category chain is still here!
    // if you want to put variables or something else in between here, you need to break the chain
    // by using a semicolon and then use manager.category('other') again. You can omit the
    // description when the category already exists.

    .add(new Command('echo')
      .parameter('text', 'string', 'echo value', { isTextParameter: true })
      .description('sends you back the same message you sent')
      .handler((player, text) => {
        mode.chat.send(player, `echo: ${text}`);
      }))


    .add(new Command('noHandler')
      .description('this command has no handler and will output a console warning.'));
};
