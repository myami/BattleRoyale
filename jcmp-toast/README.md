# jcmp-toast

![toast_example](https://cloud.githubusercontent.com/assets/13921690/22406235/a5ad5f3e-e64f-11e6-8ac8-96b4a8ab5bc7.png)



Toast's for Just Cause 3, using [jQuery toast plugin](https://github.com/kamranahmedse/jquery-toast-plugin)

For make your customs Toast and see about the plugin check [Demo](http://kamranahmed.info/toast#toast-generator)

## How to use:

#### From CEF:

```javascript
jcmp.CallEvent('cef_toast_show', JSON.stringify({
    heading: 'Warning',
    text: 'It is going to be supper easy for you to use ;)',
    showHideTransition: 'plain',
    icon: 'warning'
}));
```

#### From Client side:

```javascript
jcmp.events.Call('client_toast_show', {
    heading: 'Warning',
    text: 'It is going to be supper easy for you to use ;)',
    showHideTransition: 'plain',
    icon: 'warning'
});
```

#### From Server side:
```javascript
jcmp.events.Call('toast_show', player,  {
    heading: 'Information',
    text: "Hi i'm a info toast!",
    icon: 'info',
    loader: true,
    loaderBg: '#9EC600',
    position: 'top-right',
    hideAfter: 10000
});
```
