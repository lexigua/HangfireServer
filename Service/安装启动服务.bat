@echo ����������......  
@echo off
@sc create BTWindowsServer1 binPath= "E:\Users\HangfireSchedule\Service\BTDataSyncServer\bin\Release\BTWindowsServer.exe" 
@sc description BTWindowsServer1 Windows����ƽ̨
@net start BTWindowsServer1
@sc config BTWindowsServer1 start= AUTO  
@echo off  
@echo BTWindowsServer1 ������ϣ�  
@pause  