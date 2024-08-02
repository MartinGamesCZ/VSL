declare i32 @printf(i8*, ...)

define void @print(i8* %str) {
  %1 = call i32 @printf(i8* %str)
  ret void
}
