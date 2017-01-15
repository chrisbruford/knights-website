module.exports = function(DataService,wings) {
    let vm = this;
    
    DataService.getMembers()
    .then(data=>{
        vm.members = data;
    });

    vm.wingPics = {};

    wings.forEach(wing=>{
        vm.wingPics[wing.name] = {
            src: wing.src,
            alt: wing.alt,
            title: wing.alt
        }
    });

    console.dir(vm.wingPics);

}