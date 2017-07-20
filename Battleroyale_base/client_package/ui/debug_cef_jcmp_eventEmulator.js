var jcmp = {};
jcmp.eventList = [];
jcmp.AddEvent = function(name, callback) {
    console.info("[CEF DEBUG] Added event: " + name);
    this.eventList.push({ name: name, fnc: callback });
}

jcmp.CallEvent = function(name) {
    
    var index = this.eventList.findIndex(function(e) {
        return e.name === name;
    });

    if(index == -1) {
        return new Error(`No event found with name '${name}' `);
    }

    var argsFinal = [...arguments];
    argsFinal.splice(0,1);

    //console.log(argsFinal);
    //console.log(index);
    this.eventList[index].fnc(...argsFinal);

}