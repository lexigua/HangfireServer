@echo ����������......  
@echo off
@sc create BTWindowsServer binPath= "E:\Users\HangfireSchedule\Service\BTDataSyncServer\bin\Debug\BTDataSyncServer.exe" 
@sc description BTWindowsServer Windows����ƽ̨
@net start BTWindowsServer
@sc config BTWindowsServer start= AUTO  
@echo off  
@echo BTWindowsServer ������ϣ�  
@pause  