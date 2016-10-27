//input parameters -->> pageSize and sortType

Parse.Cloud.define("getData", function (request, response) {
    var insteractQuery = new Parse.Query("Insteract");
    var pageSize = request.params.pageSize;
    var sortType = request.params.sortType;
    if (!pageSize){
        pageSize = 100000; //for now keep a big number
    }
    insteractQuery.include("ItemPointer")
                  .limit(pageSize)
                  .select("recordRef")
                  .select("companyId")
                  .select("active")
                  .select("ItemPointer.aairport")
                  .select("ItemPointer.acode")
                  .select("ItemPointer.dairport")
                  .select("ItemPointer.dcode");
    if (sortType == "ASC"){
        insteractQuery.ascending("updatedAt");
    }
    else{
        insteractQuery.descending("updatedAt");
    }
    return insteractQuery.find().then(function (insteractList) {
        response.success(insteractList);
    }, function (err) {
        console.log(err.message);
        response.error(err.message);
    });
});

//input is companyId and sortType
Parse.Cloud.define("getDataByCompanyId", function (request, response) {
    var insteractQuery = new Parse.Query("Insteract");
    var companyId = request.params.companyId;
    var sortType = request.params.sortType;
    if (!companyId){
        response.success("Please provide a companyID");
    }
    insteractQuery.include("ItemPointer").equalTo("companyId",companyId);
    if (sortType == "ASC"){
        insteractQuery.ascending("updatedAt");
    }
    else{
        insteractQuery.descending("updatedAt");
    }
    return insteractQuery.find().then(function (insteractList) {
        response.success(insteractList);
    }, function (err) {
        console.log(err.message);
        response.error(err.message);
    });
});
