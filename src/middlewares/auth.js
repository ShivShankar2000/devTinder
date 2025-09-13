const userAuth = (req, res, next) => {
    const token = "Shiv"
    const isAuthorized = token === "Shiv"
    if(!isAuthorized){
        return res.status(401).send("Unauthorized!")
    }else{
        next()
    }
}

const adminAuth = (req, res, next) => {
    const token = "Shiv"
    const isAuthorized = token === "Shiv"
    if(!isAuthorized){
        return res.status(401).send("Unauthorized!")
    }else{
        next()
    }
}

module.exports = {userAuth, adminAuth}