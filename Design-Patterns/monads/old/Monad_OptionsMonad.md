# Option Mondads
### (also known as a Maybe)

- `number = a number`
- `Option<number>` = a number OR nothing
- `Option<User>` = a User OR nothing
<br>
It's like the fact that something can be null or undefined but using an explicit type which makes it safer and easier to check a compile time.

## The Three Components
### Wrapper Type
`Option<T>`
- it's generic so it can wrap any type
- example: `Option<number>`, `Option<string>`
- ex2: NumberWithLogs can become -> `ThingsWithLogs<T>`
<br> So now you can add logs to anything, not just numbers 

### Wrap Function
- turns T's into `Option<T>`'s
- ex: 
``` 
function some<T>(
    x: T
): Option<T> 
```
- takes the thing of type `t` and wraps it in an option, giving an option of t. In option's case it's called `some` because it marks the thing as being something rather than nothing which is the value "none". 

### Run Function
- runs transformation on `Option<T>`'s
- ex:
```
function run<T>(
    input: Option<T>,
    transform: (_: T) => Option<T>
): Option<T> {    

}
```
- Accepts an option and a transformation func to run as normal. The only difference here is that the function is generic; which means it can work on options of numbers, options of strings, etc.

You can think of it as: <br>
`T = "raw type"` 
<br>
`Option<T> = "wrapped T"`

Just like the transform function before, like sqaure took a number which is the raw type, and returned a number with logs which is the wrapped type.

```
NumberWithLogs transform: number => NumberWithLogs
```

The transform function take a t as the raw type and returns an option of t, the wrapped type.

```
transform: (_: T) => Option<T>
```

Here's what the rest of the run function looks like:

```
function run<T>(
    input: Option<T>,
    transform: (_: T) => Option<T>
): Option<T> {    
    if (input == none) {
        return none
    }
    return transform(input.value)
}
```
If you pass in something with a value of none, it returns none. If you pass something with a value in it, it runs the transform on that value. This lets you chain operations without worrying about none values.

To see how this might be useful, let's look at a use case where we want to fetch the current user, get the user's pet, then the pet's nickname, where all of those things could be missing.

Here's what it might look like without the monadic option:
### Without Option
```
function getPetNickname(): string | undefined {
    const user: User | undefined = getCurrentUser()
    if (user == undefined) {
        return undefined
    }

    const userPet: Pet | undefined = getPet(user)
    if (userPet === undefined) {
        return undefined
    }

    const userPetNickname: string | undefined = getNickName(userPet)
    return userPetNickName
}
```
Everytime you run an operation, you gotta check to see if the result is undefined, and shortcircuit to avoid continuing. The syntax:  `user | undefined` means that the user variable is either a user or undefined, which is often how missing values are represented in js.

With the monads, it this same logic looks so much cleaner, assuming those get functions now return options.  
### With Option
```
function getPetNickname(): Option<string> {
    const user: Option<User> = getCurrentUser()
    const userPet: Option<Pet> = run(user, getPet)
    const userPetNickname: Option<string> = run(userPet, getNickname)
    return userPetNickname
}
```
In this code above, the true value of options becomes clearer. Not once in this code is undefined or things being missing checked manually. It all happens in `run`. If user is nothing, for example, userPet and userPetNickname will also be nothing, and getPet and getNickname will not be run.

It's so convenient to be able to manage the lack of a value without constantly having to perform checks all over the place. In some languages, you can call `run` as a method on the option directly so the code becomes even cleaner and more chainable
```
function getPetNickname(): Option<string> {
    return getCurrentUser().run(getPet).run(getNickname)
}
```

#### Monads are a design pattern that allows **a user to chain operation** while *the monad manages secret work behind the scenes*.

### With Missing Values via Option
```
function getPetNickname(): Option<string> {
    const user: Option<User> = getCurrentUser()
    const userPet: Option<Pet> = run(user, getPet)
    const userPetNickname: Option<string> = run(userPet, getNickname)
    return userPetNickname
}
```

not much different between handling missing values and the abstracted away handling of missing values. Less if statements as well if you use the options monad.

### Without Missing values
```
function getPetNickname(): Option<string> {
    const user: User = getCurrentUser()
    const userPet: Pet = run(user, getPet)
    const userPetNickname: string = run(userPet, getNickname)
    return userPetNickname
}
```