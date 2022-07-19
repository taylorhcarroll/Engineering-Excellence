
// let username = "Taylor"
// let userObject = database.fetch(username)
// let userFriends = userObject.friends
// let firstFriend = userFriends.first()
// let firstFriendGender = userFriends.gender

//any of the following could fail if database is down or if the friend doesn't have a gender etc

//to remedy this, you would probably add a bunch of checks to these calls like so:

// let username = "Taylor"
// let userObject = database.fetch(username)
// if (userObject != null) {
//     let userFriends = userObject.friends
//     if (userFriends != null) {
//         let firstFriend = userFriends.first()
//         if (firstFriend != null) {
//             let firstFriendGender = userFriends.gender
//         }
//     }
// }

//this gets kinda verbose, ugly, hard to read, and we focus on the implementation rather than the actual operation


// to refactor lets create a new class below


// class Maybe {
//     constructor (value) {
//         this.value = value
//     }

//     bind = function (func) {
//         value = func(this.value)
//         return Maybe(value)
//     }
// }

// we can now rewrite our original pipeline using a set of chained bind calls

// let firstFriendName = Maybe("Taylor")
//     .bind(database.fetch)
//     .bind(user => user.friends)
//     .bind(friends => friends.first())
//     .bind(friend => friend.gender)


//there is now only one place functions are being called, on the bind method
//this means you can add any extra computation logic or whatever you want really, and it's all done in one place



class Maybe {
    constructor (value) {
        this.value = value
    }

    bind = function (func) {
        if (this.value == null) {
            return this
        }
        value = func(this.value)
        return Maybe(value)
    }
}

let firstFriendName = Maybe("Taylor")
    .bind(database.fetch)
    .bind(user => user.friends)
    .bind(friends => friends.first())
    .bind(friend => friend.gender)

//what we have is a design pattern in which pipeline implementation is abstracted by wrapping a value in a type.
//the code above describes what we want, and not how to do it, which makes it delcarative

//this example will keep a log of every step of the pipeline so we can review what happens
class Functor {
    constructor (value, log=null) {
        this.value = value
        this.log = log || []
    }

    apply = function (func) {
        value = func(this.value)
        return Functor(value, log=[...this.log, value])
    }
}

//properties of this functor object, simulate a sort of mutable state, while using immutable data

// let firstFriendName = Maybe("Taylor")
//     .bind(database.fetch)
//     // log = [dbObj]
//     .bind(user => user.friends)
//     // log = [dbObj, fList]
//     .bind(friends => friends.first())
//     // log = [dbObj, fList, friendObj]
//     .bind(friend => friend.gender)