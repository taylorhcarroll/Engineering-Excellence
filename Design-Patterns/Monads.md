# Monads

// endofunctor - a mapping of objects and morphisms from one Category back to the same Category

// monoid -  a set equipped with an associative binary operation and an identity element

### Starting Code:

```
function square(x: number): number {
    return x * x
}

function addOne(x: number): number {
    return x + 1
}
```
### Starting Call
```addOne(square(2)) => 5 ```

So let's say we wanted add historical logging to these functions so we can view the process of how we got there.

### Call With Logging
```
addOne(square(2)) => {
    result: 5,
    logs: [
        "Squared 2 to get 4"
        "Added 1 to 4 to get 5"
    ]
}
```
This can be useful for audit trail.
So how do we built this feature? First we want to define a struc to capture the return type, which we'll call NumberWithLogs. It has the result and the logs array.

### Code with Logging

```
interface NumberWithLogs {
    result: number
    logs: string[]
}
```
Second, we'll make a square function return a number with logs and a return the expected shape.

```
function square(x: number): NumberWithLogs {
    return {
        result: x * x,
        logs: [`Squared ${x} to get ${x * x}.`]
    }
}
```

Third, we'll change addOne to take a numberWithLogs, and perform the expected operation. 

``` 
function addOne(x: NumberWithLogs): NumberWithLogs {
    return {
        result: x.result + 1
        logs: x.logs.conat([
                `Added 1 to ${x.result} to get ${x.result + 1}`
            ])
    }
}
```
Since it's taking NumberWithLogs as the argument, we need to combine whatever logs came in, with the new logs by appending the new entry at the end.

### Issues
There are some issues with how the above is written. For example, what if I want to do `square(square(2))`
It won't work because the first square returns a NumberWithLogs but the 2nd square expects a number. You'll get an error like 
```
Argument of type 'NumberWithLogs' is not assignable to parameter of type 'number'.
```
Also, what if I want to do `addOne(5)`? It doesn't work because addOne expects NumberWithLogs, not a normal number.
```
Argument of type 'number' is not assignable to parameter of type 'NumberWithLogs'.
```

We can fix this with a new function called: `wrapWithLogs()` which takes a NumberWithLogs like a constructor of sorts. It helps numbers enter the NumnberWithLogs ecosystem so that one can call functions that expect NumberWithLogs. We set the logs to an empty array `[]` since nothing has been done to it yet.

### New Function
```
function wrapWithLogs(x: number): NumberWithLogs {
    return {
        result: x,
        logs: []
    }
}
```
### Tweaked Square Function
```
function square(x: NumberWithLogs): NumberWithLogs {
    return {
        result: x.result * x.result,
        logs: xlogs.conat([
            `Squared ${x.result} to get` +
            `${x.result * x.result}.`
        ])
    }
}
```
That was we can execute square of square of 2

### New Call Pattern
```
square(square(wrapWithLogs(2)))
addOne(wrapWithLogs(5))
```

### Issues cont:
There seems to be some duplicated code, specifically both are doing log concatenation. Let's factor this out. 

#### Code With Tweaks
```
function square(x: NumberWithLogs): NumberWithLogs {
    return {
        result: x.result * x.result,
        logs: xlogs.conat([
            `Squared ${x.result} to get` +
            `${x.result * x.result}.`
        ])
    }
}

function addOne(x: NumberWithLogs): NumberWithLogs {
    return {
        result: x.result + 1,
        logs: x.logs.concat([
            `Added 1 to ${x.result} to get ${x.result + 1}.`
        ])
    }
}
```

#### Reorganized Sqaure (same logic)
```
function square(x: NumberWithLogs): NumberWithLogs {
    const newNumberWithLogs = {
        result: x.result * x.result,
        logs: [
            `Squared ${x.result} to get` +
            `${x.result * x.result}.`
        ]
    }
    return {
        result: newNumberWithLogs.result,
        logs: xlogs.concat(
            newNumberWithLogs.logs
            )}
}
```

#### Old Call Style
```
addOne(wrapWithLogs(5))
```

#### New Call Style
```
runWithLogs(wrapWithLogs(5), addOne)
```
This may seem like more code than before, but let's see how we can take some of the load off of our add and sqaure functions.

#### New runWithLogsFunction
```
function runWithLogs(
    input: NumberWithLogs,
    transform: (_: number) => NumberWithLogs
): NumberWithLogs {
        const newNumberWithLogs = transform(input.result)
        return {
            result: newNumberWithLogs.result,
            logs: input.logs.concat(newNumberWithLogs.logs)
        }
}
```
our new runWithLogs func takes 2 arguments. <br>
1. NumberWithLogs, as seen at the `input`.
2. A function to apply to a number that returns a new NumberWithLogs, as seen at the `transform` <br>
The overall function returns a NumberWithLogs.

First we run the transformation func like `addOne()` on the number passed in, to get a newNumberWithLogs
```
const newNumberWithLogs = transform(input.result)
```

Then, we take the number from it and use that as the result
```
result: newNumberWithLogs.result
```
and take the logs from the input we passed in, and append any logs generated
```
logs: input.logs.concat(newNumberWithLogs.logs)
```
All that's different is we've taken the squareE part and moved it to the transform argument so it becomes more felxible. The net result is that square and addOne do not need to do log concatenation, and become simpler. They also don't need to take a number with logs as their argument anymore and can just take a simple number.

#### Simpler square function
```
function square(x: number): NewWithLogs {
    return {
        result: x * x,
        logs: [`Square ${x} to get ${x * x}.`]
    }
}
```

### Final Code: (please see monads.ts)

## All monads have 3 components:
<ol>
<li>Wrapper Type  
    <ul> 
        <li>Ex: NumberWithLogs </li>
    </ul>
</li>
<li>Wrap Function 
    <ul>
        <li>allows entry into monad system</li>
        <li>also known as: return, pure, unit</li>
        <li>Ex: `function wrapWithLogs(x: number): NumberWithLogs`</li> 
    </ul>
</li>
<li>Run Function 
    <ul>
        <li>runs transformation on monadic values</li>
        <li>also known as: bind, flatMap, >>=</li>
        <li>Ex: `function runWithLogs(input: NumberWithLogs, transform: (_: number) => NumberWithLogs): NumberWithLogs`</li>
    </ul>
</li>
</ol>
