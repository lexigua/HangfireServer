@echo 服务启动中......  
@echo off
@sc create BTWindowsServer binPath= "E:\Users\HangfireSchedule\Service\BTDataSyncServer\bin\Debug\BTDataSyncServer.exe" 
@sc description BTWindowsServer Windows服务平台
@net start BTWindowsServer
@sc config BTWindowsServer start= AUTO  
@echo off  
@echo BTWindowsServer 启动完毕！  
@pause  