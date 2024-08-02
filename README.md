# VSL

## Introduction

VSL is a statically typed programming language. It is a simple language with a syntax similar to C++ and Java. The language is designed to be easy to learn and understand, while still being powerful enough to write complex programs.

## Why?

Idk, I was bored.

## Concept

### Types

#### Numeric
- `byte` - 8-bit unsigned integer
- `short` - 16-bit signed integer
- `int` - 32-bit signed integer
- `long` - 64-bit signed integer

- `float` - 32-bit floating point number

#### Alphanumeric
- `char` - 8-bit character
- `string` - 8-bit character array

#### Logical
- `bool` - 8-bit boolean

#### Special
- `void` - No return type

### Variables

#### Immutable

```vsl
val x: int = 5;
```

#### Mutable

```vsl
var x: int = 5;
```

### Comments

Every line starting with # is a comment. It is ignored by the compiler.

```vsl
# This is a comment
# Look how pretty this comment is!
```

### Functions

Functions are defined with `fun` keyword. Here are some examples of functions in VSL.

```vsl
fun getGreeting(name: string): string {
  return core.sprintf( "Good morning, %s!", name );
}

# A function with optional arguments - PLANNED
fun getName(optional name: string): string {
  if (name != null) return name;
  return "Joe";
}
```

## Contributors
- [Martin Petr](https://github.com/MartinGamesCZ) - Concept, Syntax, Compiler
- [Vendelín Mžik](https://github.com/Binekrasik) - Concept, Syntax, Compiler
