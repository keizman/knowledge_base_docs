
## [Security Checks](https://github.com/droidrun/droidrun)


To ensure the security of the codebase, we have integrated security checks using `bandit` and `safety`. These tools help identify potential security issues in the code and dependencies.

### Running Security Checks

Before submitting any code, please run the following security checks:

1. **Bandit**: A tool to find common security issues in Python code.
    
    ```shell
    bandit -r droidrun
    ```
    
2. **Safety**: A tool to check your installed dependencies for known security vulnerabilities.
    
    ```shell
    safety check
    ```
    

You can also run both checks using the provided script:

```shell
python -m droidrun.tools.security_check
```