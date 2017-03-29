start-process powershell.exe -argument '-NoExit -nologo -noprofile -executionpolicy bypass -command npm run bserver'
start-process powershell.exe -argument '-NoExit -nologo -noprofile -executionpolicy bypass -command npm run bclient'
# start-process powershell.exe -argument '-NoExit -nologo -noprofile -executionpolicy bypass -command npm run gserver'
start-process powershell.exe -argument '-NoExit -nologo -noprofile -executionpolicy bypass -command npm run cserver'