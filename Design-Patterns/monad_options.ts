//monad options design pattern

//In progress, does not compile yet

// Example situation: representing FAILURE using TYPES:
interface Option<A> {
    //this mapping makes Option a Functor
    // ie. the "open box and trasnform contents" mapping
    map<B>(f: (a: A) => B): Option<B>;

    //This mapping makes Option a Monad
    // ie the "open box and transform content TO OPTION
    // "...which leaves us with an Optuon<Option<B>>"
    //"...which is ugly, so FLATTEN IT back to Option<B>"
    // this is also called flatMap in Scala
    // also called "chain in some FP libs for JS"
    // also called flatMap in JS for Array recently
    // also named "bind" or ">>=" in Haskell
    //Haskell has special syntax called do-notation that allows you to avoid writing a call to this mapping explicitly
    flatMap<B>(f: (a: A) => Option<B>): Option<B>;
}

//Example

type Employee = {
    name: string;
    id: string;
    supervisorId: string;
}

const exampleEmployee = {
    name: "Alice",
    id: "12345",
    supervisorId: "98765"
}
function example(
    // can fail employee not in DB etc...
    // so the type `string => Employee` would be a dirty lie
    // this type `string => Option<Employee>` better reflects reality
    loadEmployeeById: (s: string) => Option<Employee>
) {
    const alice = loadEmployeeById("12345")
    //so far so good but what if we need to load her supervisor
    //this won't work
    //const supervisor = loadEmployeeById(alice.supervisorId)
    //so we try functorMap
    //const supervisor = alice.map(a => loadEmployeeById(a.supervisorId))
    // with FunctorMap we are left with doublenested Option
    // we have no use for Option<Option<Employee>> in this situation
    // we just want an Option<Emoployee>
    //so we use .flatMap, which FLATTENS unesscessary double nesting:
    const supervisor = alice.flatMap(a => loadEmployeeById(a.supervisorId))
    console.log(supervisor)
}

// function run<T, U>(opt: Option<T>, func: (_: T) => U): Option<U> {
//     if (opt.exists()) {
//         return Option.of(func(opt.get()))
//     }
//     return Option.none()
// }

// // function run<T>(
// //     input: Option<T>,
// //     transform: (_: T) => Option<T>
// // ): Option<T> {    
// //     if (input == none) {
// //         return none
// //     }
// //     return transform(input.value)
// // }

// function getPetNickname(): Option<string> {
//     const user: Option<User> = getCurrentUser()
//     const userPet: Option<Pet> = run(user, getPet)
//     const userPetNickname: Option<string> = run(userPet, getNickname)
//     return userPetNickname
// }