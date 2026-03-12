(function(){
    'use strict';
    console.log('running js');

    const rollBox = document.querySelector('#box1');
    const holdBox = document.querySelector('#box2');
    const bodyTag = document.querySelector('body');

    rollBox.addEventListener('mouseover', function(){

        bodyTag.className='pagecolor2';
    });
    rollBox.addEventListener('mouseout', function(){

        bodyTag.className='pagecolor1';
    });

    holdBox.addEventListener('mouseover', function(){

        bodyTag.className='pagecolor3';
    });
    holdBox.addEventListener('mouseout', function(){

        bodyTag.className='pagecolor1';
    });
})();