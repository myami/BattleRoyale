# JC3:MP Chat
this package provides the previous default chat.

## Using the Package as Dependency
When you want to use the chat as a dependency for your package, make sure to add it to your `jcmp_dependencies` array. You can then use the following code snippet to get the chat object:

```
const chat = jcmp.events.Call('get_chat')[0];
```

The returned object provides these functions:

### `chat.send(target: Player, message: string, color: RGB = new RGB(255, 255, 255))`
* target: target Player
* message: message string
* color (optional): rgb color for the message

Example:
```
jcmp.events.Add('PlayerDeath', player =>
  chat.send(player, "You died.");
});
```

### `chat.broadcast(message: string, color: RGB = new RGB(255, 255, 255))`
* message: message string
* color (optional): rgb color for the messageExample:

Example:
```
jcmp.events.Add('PlayerDeath', () =>
  chat.broadcast("Someone died!");
});
```

### `chat.addCustomCSS(css: string)`
* css: css string.
    
## Formatting Messages
Your messages can include any html.
If you want your message to include multiple colors, you can do that by using color tags in this format: `[#RRGGBB]`

Example
```
jcmp.events.Add('PlayerDeath', player =>
  chat.send(player, "[#ff0000]You [#ffffff]died.");
  // You will be red, the rest will be white
});
```

## Contributing
If you wish to contribute to the chat, please follow this workflow:

1. Look for open, unassigned [issues](https://gitlab.nanos.io/jc3mp-packages/chat/issues) and claim them by commenting on the issue whether you can take it on.
1. If you want to implement something new, either create an issue first and wait for the response from a JC3:MP developer or work on your fork and request a merge after that. It might get rejected, however.
2. Fork the Repository
3. Work on your fork
4. Create a [Merge Request](https://gitlab.nanos.io/jc3mp-packages/chat/merge_requests)

### Code Styleguide
A code styleguide will be enforced by `eslint`, the according configuration file is in the repository. Merge requests breaking the styleguide will be rejected.

The merge request will be reviewed by a staff member and according feedback will be given. If you want to open your merge request but have not finished the feature yet, remember to start the merge request's title with `WIP: `.