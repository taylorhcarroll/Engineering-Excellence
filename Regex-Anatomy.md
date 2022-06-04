# Regex-Anatomy
## anatomy of regular expressions and how to use them
#### this applies to multiple languages.

https://regexr.com/ is a great resource to practice regular expressions.


## An Overview

regexexample:
```
/cat/g
```

example string:
```
The fat cat ran down the street.
It was searching for a mouse to eat.
```
what goes inbetween the slashes is the search criteria
in this case we're looking for the string 'cat'
what comes after the closing slash are tags such as:

g Means global
i means case insensitive
m is multiline
s is singleline
u is unicode
y is sticky

By itself, the search crtieria is not all that powerful.
But let's say we want to search for all ee's
If you do ```/e+/g``` it will match as many e's ina row you can find but will match with at minimum one 'e'.

```/ea?/g ``` means it will look for all e's and all a's that come after e but the a is optional.
Whatever character that comes before the ? is considered "optional"

``` /re*/g ``` the * is optional but match as many as zero or more. So it would match the ree in 'street' or just the r in 'for'

```/.at/g```  the '.' will match anything, so in this case it would match 'cat' 'rat' or 'eat'
```/t../``` will match anything starting with t and the next two characters after it including spaces. so 'street' will match 'tre' or ' to ' will return 'to '
PLEASE NOTE THE '.' WILL NOT CONTINUE ON TO NEW LINES.

to find a '.' you can use ```/\./g``` the backslash escape the character, meaning it will treat the '.' as a normal character

```/\w/g``` 'w'will match any word
```/\W/g``` CAPS W will match anything that's not a character

```/\s/``` will match any whitespace so 'The cat' will match ' '
```/\S/``` CAPS S will match anything not whitespace

```/\w/{4,5}g``` inside the curly braces is a 4 and a 5, this means find anything that matches the crtieria that is minimum of 4 characters long or max of 5.

```/[fc]at/g``` will match anything that starts with the characters 'f' or 'c' AND ends with an 'at' so this would return 'fat' and 'cat' from the above example up top.

but you can also do a range of characters too like...
```/[a-z]at/g```
or
```/[a-zA-z]at/g``` this searches for lowercase and upper

```/[0-9]at/g``` you can also search by numbers

you can also put things in a group

```/(t|T)he/g``` the ```|``` allows for lower t OR upper T to find 'the' and 'The'

```/(t|e|r){2,3}/g``` means we want to match at minimum two, max all 3 of the characters in that group. so 'street.' will match both 'tre' and 'et'
but you can go a step further can do this:
```/(t|e|r){2,3}\./g``` to match the period as well. 'street.' then results in 'eet.'
remember that the ```()``` grouping allows whatever comes after the closing parens to affect what is in it. So the ```{2,3}``` affects the t e and r
however if you had
```/re{2,3}/g``` the ```{2,3}``` logic is only affecting the 'e' in this case, not the r. to include the r you must put both in a parentheses like
```/(re){2,3}/g```

```/^/g``` means match the beginning of the line

```
The fat cat ran down the street.
It was searching for a mouse to eat.
```

would result in 'T' from the first line

```/^I/g``` returns nothing, WHY? we need a MULTILINE flag

```/^I/gm``` now gives us the 'I' from line 2.

```/[Tt]he/g``` will look for all the 'the' words both upper and lower but adding a carrot

```/^[Tt]he/g``` will return just the The from the beginning of the block of text.

```/\.$/gm``` the ```$```searches for last character in a line. our regex therefore returns the '.' from both lines

Positive look Behinds
```/(?<=[tT]he)./g``` results in the first character that comes after 'The' or 'the'. You get the two ' ' in this case, but not the actual word the

Negative Look Behinds
```/(?<![tT]he)./g``` this matches every single character EXCEPT the one that was preceded by the word 'the'.

More Examples
```/.(?=at)/g``` gives you any characters that is followed by 'at' so you'll get the 'f' 'c' and 'e' from 'fat' 'cat' and 'eat'.


RegEx to check for Phone Number

```
1234567890
```
```/\d{10}/g``` gives me a match becasue it's looking for 10 digits in a row.

how do we account for multiple formats like the following:

```
1234567890
123-456-7890
```

```/\d{3}-?\d{3}-?\d{4}/gm```

This gives you a match for both because it looks for 3 nums, - is optional, 3 more nums dash optional, and finally 4 nums

what about
```123 456 7890 ```?

```/\d{3}[ -]?\d{3}[ -]?\d{4}/gm```

by putting the ```' '``` AND ```'-'``` in a grouping we now say both are optional

Now let's say we want to match all 3 formats but convert them all so that they only contain 10 digits in order to keep clean uniform data?

What we need to do is capture all of our digits and we can do that with capture groups. Keep in mind putting things in a parentheses actually captures it.

By adding parens around our search criteria for the digits we capture those nums.
```/(\d{3})[ -]?(\d{3})[ -]?(\d{4})/gm```
Groups can then be manipulated like so:
```$1$2$3``` returns ```1234567890```
This is because we are saying to put group1 group2 and group3 one after another.
By default you can call groups like this but you can also attach labels to them!

/* As an aside, if you following along on Regexer.com plug the $1$2$3 into the replace tool at the bottom of the page. It might be kind of hard to visualize until we assign a label to the capture groups */

```/(?<areacode>\d{3})[ -]?(\d{3})[ -]?(\d{4})/gm```
labels group1 as 'areacode'

now let's get fancy ( ͡° ͜ʖ ͡°)

```
1234567890
123-456-7890
123 456 7890
(123) 456-7890
+1 123 456 7890
```
``` /(\+1[ -])?\(?(?<areacode>\d{3})\)?[ -]?(\d{3})[ -]?(\d{4}) ``` now accounts for both the (123) and the +1 preceding

you will notice the +1 also contains a space at the end so we can add another grouping around just the +1

```
/((\+1)[ -])?\(?(?<areacode>\d{3})\)?[ -]?(\d{3})[ -]?(\d{4})
```

so now we can have a grouping that's just the +1 without the space at the end.
This leaves us with two groups regarding the +1, so how can we omit the one we don't need?

```/(?:(\+1)[ -])?\(?(?<areacode>\d{3})\)?[ -]?(\d{3})[ -]?(\d{4})```

```(?:)``` non capturing group - the regex inside the parenthesis must be matched but doesn't create the capturing group

```$1$2$3$4``` will print out the following from our 4 phone numbers above:

```
1234567890
1234567890
1234567890
1234567890
+11234567890
```


## To Recap:

### Basics 💡

```/ expression / flags ``` ie ```/[A-Z]+/g ``` basic format
```/ hello\?\*\\/ ``` escape special characters with backslashes
``` () ``` to group with parentheses
``` | ``` the logical OR operator

### Character Classes ⚔️
`\w` word <br>
`\d` digit <br>
`\s` whitespace (tabs, line breaks) <br?

`\W` NOT word <br>
`\D` NOT digit <br>
`\S` NOT whitespace <br>

`\t` tabs <br>
`\n` line breaks <br>
`.` any character (except newline) <br>

### Brackets 🦕

`[xyz]` match any x,y,z <br>
`[J-Z]` match any capital letters between J & Z <br>
`[^xyz]` NOT x,y, or z <br>

### Quantification 🧮

`bob|alice` match bob or alice <br>
`z?` zero or one occurences <br>
`z*` zero or multiple occurences <br>
`z+` one or multiple occurences <br>
`z{n}` n occurences <br>
`z{min,max}` min/max occurences <br>

### Anchors ⚓

`hello world` exact match
`^hello` start of the strings
`world$` end of the string

## How to Use Regex in JS

### Create Regular Expression
