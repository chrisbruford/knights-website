module.exports = function(DataService) {
    let data = DataService.getMembers();
    data.then(data=>{
        this.members = data;
    });

}