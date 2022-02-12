pragma solidity ^0.8.0;

contract legacyProject{
    mapping(address=>address)public inheritor;
    mapping(address=>uint)public legacyValue;
    mapping(address=>uint)public timer;
    mapping(address=>uint)public periods;
    mapping(address=>uint)public intervalTime;
    mapping(address=>uint)public amountPerPeriod;
    bool _reEnterLock;
    constructor(){
        _reEnterLock=false;
    }
    function setLegacy(address _inher,uint _days,uint _periods,uint _intervalTime)external payable{
        require(inheritor[msg.sender]==address(0),"you have setted already.");
        require(_inher!=address(0),"invalid address");
        require(msg.value!=0,"invalid value");
        require(_periods>0,"periods most bigger than zero");

        inheritor[msg.sender]=_inher;
        legacyValue[msg.sender]=msg.value;
        timer[msg.sender]=block.timestamp+_days*(1 days);
        periods[msg.sender]=_periods;
        intervalTime[msg.sender]=_intervalTime;
        amountPerPeriod[msg.sender]=msg.value/_periods;
    }
    function ownerWithdraw()external haveContract reEntryLock{
        payable(msg.sender).transfer(legacyValue[msg.sender]);
        legacyValue[msg.sender]=0;
        delete inheritor[msg.sender];
    }
    function resetTimer(uint _days)external haveContract{
        timer[msg.sender]=block.timestamp+_days*(1 days);
    }
    function inheritorClaim(address owner)external reEntryLock{
        require(msg.sender==inheritor[owner],"you are not the inheritor");
        require(legacyValue[owner]>0,"no legacy left");
        require(timer[owner]<=block.timestamp,"can not claim yet");

        if (legacyValue[owner]>=amountPerPeriod[owner]){
            payable(msg.sender).transfer(amountPerPeriod[owner]);
            legacyValue[owner]-=amountPerPeriod[owner];
            timer[owner]=block.timestamp+(intervalTime[owner]*(1 days));
        }else{
            payable(msg.sender).transfer(legacyValue[owner]);
            legacyValue[owner]=0;
        }
    }
    modifier haveContract(){
        require(inheritor[msg.sender]!=address(0),"you haven't setted the legacy");
        _;
    }
    modifier reEntryLock(){
        require(_reEnterLock==false,"can not re enter");
        _reEnterLock=true;
        _;
        _reEnterLock=false;
    }
}