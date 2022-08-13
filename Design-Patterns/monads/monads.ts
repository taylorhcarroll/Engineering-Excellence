//A basic Monad


interface NumberWithLogs {
    result: number
    logs: string[]
}

function square(x: number): NumberWithLogs {
    return {
        result: x * x,
        logs: [`Squared ${x} to get ${x * x}.`]
    }
}

function addOne(x: number): NumberWithLogs {
    return {
        result: x + 1,
        logs: [`Added 1 to ${x} to get ${x + 1}.`]
    }
}

function wrapWithLogs(x: number): NumberWithLogs {
    return {
        result: x,
        logs: []
    }
}

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


//examples:
const a = wrapWithLogs(5)
const b = runWithLogs(a, addOne)
const c = runWithLogs(b, square)
//and we could feasibly scale this up with new functions like below
//const d = runWithLogs(c, multiplyByThree)

