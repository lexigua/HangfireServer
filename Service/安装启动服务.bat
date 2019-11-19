@echo 服务启动中......  
@echo off
@sc create BTWindowsServer1 binPath= "E:\Users\HangfireSchedule\Service\BTDataSyncServer\bin\Release\BTWindowsServer.exe" 
@sc description BTWindowsServer1 Windows服务平台
@net start BTWindowsServer1
@sc config BTWindowsServer1 start= AUTO  
@echo off  
@echo BTWindowsServer1 启动完毕！  
@pause  