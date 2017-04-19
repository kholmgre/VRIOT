start-process powershell.exe -argument '-NoExit -nologo -noprofile -executionpolicy bypass -command npm run buildTicServer'
start-process powershell.exe -argument '-NoExit -nologo -noprofile -executionpolicy bypass -command npm run buildTicClient'
start-process powershell.exe -argument '-NoExit -nologo -noprofile -executionpolicy bypass -command npm run ticserver'
start-process powershell.exe -argument '-NoExit -nologo -noprofile -executionpolicy bypass -command npm run cserver'