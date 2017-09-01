function man(name) 
{
    this.name = name;
    console.log(name);
    return {
        'name' : name
    }
}

function woman() 
{
    
}

exports.man =  function (name) 
{
    new man(name) ;
}

exports.woman =  function () 
{
    new woman() ;
}