define i32 @add(i32 %a, i32 %b) {
  %res = add i32 %a, %b
  ret i32 %res
}

define i32 @subtract(i32 %a, i32 %b) {
  %res = sub i32 %a, %b
  ret i32 %res
}

define i32 @multiply(i32 %a, i32 %b) {
  %res = mul i32 %a, %b
  ret i32 %res
}

define i32 @divide(i32 %a, i32 %b) {
  %res = sdiv i32 %a, %b
  ret i32 %res
}
