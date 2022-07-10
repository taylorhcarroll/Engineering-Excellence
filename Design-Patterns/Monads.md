# Monads

// endofunctor - ?

// monoid - ?

All monads have 3 components:
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
