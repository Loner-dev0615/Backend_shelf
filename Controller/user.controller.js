function CreateUser(){

}

function deleteUser(){

}

function updateUser(){

}

function getUsers(req, res){
    res.send('This is all the users')
}

function getUsersByID(res, req){
    res.send('This is a single user')
}

module.exports = {
    CreateUser,
    deleteUser,
    updateUser,
    getUsers,
    getUserByID
}