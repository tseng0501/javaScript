if (!jQuery) { throw new Error("isRock framework requires jQuery.") }

//call ASP.NET PageMethod
function CallPageMethod(methodName, para, onSuccess, onFail) {
    if (para == null) para = {};
    if (onSuccess == undefined) {
        onSuccess = _CallPageMethod_Success;
    }
    if (onFail == undefined) {
        onFail = _CallPageMethod_Fail;
    }
    //get URL
    var loc = window.location.href;
    loc = (loc.substr(loc.length - 1, 1) == "/") ? loc + "default.aspx" : loc
    if (loc.indexOf('#') != -1) { loc = loc.substr(0, loc.indexOf('#')); }
    if (loc.indexOf('?') != -1) { loc = loc.substr(0, loc.indexOf('?')); }
    //ajax call
    $.ajax({
        type: "POST",
        url: loc + "/" + methodName,
        data: JSON.stringify(para),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        //on success
        success: function(response) {
            onSuccess(response.d)
        },
        //on fail
        failure: function(response) {
            onFail(response);
        }
    }).fail(function(response) {
        if (response.status == 299) {
            var ex = { 'responseJSON': { 'Message': response.responseText } };
            onFail(ex);
        } else {
            onFail(response);
        }
    });
}

function _CallPageMethod_Success(result) {
    console.log('_CallPageMethod_Success Success return : ' + result, result);
    alert('ExecuteCommand Success.');
}

function _CallPageMethod_Fail(ex) {
    console.log('_CallPageMethod_Fail error : ' + ex.statusText, ex);
    alert("error : " + ex.statusText);
}

function ExecuteAPI(catalog, method, para, success, fail) {
    $.ajax({
        url: "/api/" + catalog + "/" + method,
        type: "post",
        contentType: 'application/json',
        data: JSON.stringify(para),
        success: function(apiResult) {
            if (!success) {
                _ExecuteAPIonSuccess(apiResult);
            } else {
                success(apiResult);
            }
        },
        error: function(ex) {
            if (!fail) {
                _ExecuteAPIonError(ex);
            } else {
                fail(ex);
            }
        }
    })
}

function _ExecuteAPIonSuccess(apiResult) {
    if (apiResult.isSuccess) {
        alert("aa");
    } else {
        alert("aa : " + apiResult.Message);
    }
}

function _ExecuteAPIonError(ex) {
    alert("aa : " + ex);
}