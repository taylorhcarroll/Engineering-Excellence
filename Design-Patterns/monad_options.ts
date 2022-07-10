//monad options design pattern

//In progress, does not compile yet

interface Option<T> {
    None,
    Some(T)
}



function run<T>(
    input: Option<T>,
    transform: (_: T) => Option<T>
): Option<T> {    
    if (input == none) {
        return none
    }
    return transform(input.value)
}

function getPetNickname(): Option<string> {
    const user: Option<User> = getCurrentUser()
    const userPet: Option<Pet> = run(user, getPet)
    const userPetNickname: Option<string> = run(userPet, getNickname)
    return userPetNickname
}