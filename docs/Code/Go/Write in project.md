
### generate go mod and sum


```
go mod init ask_terminal && go mod tidy
```

### Build with stripping and optimization flags

```
go build -ldflags="-s -w" -o ask.exe  main.go
```

### Use UPX to compress the binary (install UPX first)

```
upx --best ask.exe
```

```
choco install upx
```


### grammer

