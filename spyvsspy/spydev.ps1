start-process powershell.exe -argument '-NoExit -nologo -noprofile -executionpolicy bypass -command npm run spyvsspywebpack'
start-process powershell.exe -argument '-NoExit -nologo -noprofile -executionpolicy bypass -command npm run spyvsspygameserver'
start-process powershell.exe -argument '-NoExit -nologo -noprofile -executionpolicy bypass -command npm run spyvsspycontentserver'