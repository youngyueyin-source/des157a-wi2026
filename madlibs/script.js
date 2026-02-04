(function(){
	'use strict';
	console.log('reading js');

	const madlib = document.querySelector('#madlib');
	const form = document.querySelector('#form');
	const madlibOverlay = document.querySelector('#madlib-overlay');
	const closeBtn = document.querySelector('#close');
	const errorMessage = document.querySelector('#error');
    const likeBtn = document.querySelector('#like-btn');
    const likeCount = document.querySelector('#like-count');

    let likes = 0;

	form.addEventListener('submit', function(event){
		event.preventDefault();

		const adjective = document.querySelector('#adjective').value;
		const verb = document.querySelector('#verb').value;
		const jobTitle = document.querySelector('#jobTitle').value;
		const companyName = document.querySelector('#companyName').value;
		const industry = document.querySelector('#industry').value;
		const skill = document.querySelector('#skill').value;
		const buzzword = document.querySelector('#buzzword').value;
		const emoji = document.querySelector('#emoji').value;

		let myText;

		if (adjective == ''){
			errorMessage.innerHTML = 'Please provide an adjective.';
			document.querySelector('#adjective').focus();
		}
		else if (verb == ''){
			errorMessage.innerHTML = 'Please provide a verb.';
			document.querySelector('#verb').focus();
		}
		else if (jobTitle == ''){
			errorMessage.innerHTML = 'Please provide a job title.';
			document.querySelector('#jobTitle').focus();
		}
		else if (companyName == ''){
			errorMessage.innerHTML = 'Please provide a company name.';
			document.querySelector('#companyName').focus();
		}
		else if (industry == ''){
			errorMessage.innerHTML = 'Please provide an industry.';
			document.querySelector('#industry').focus();
		}
		else if (skill == ''){
			errorMessage.innerHTML = 'Please provide a skill.';
			document.querySelector('#skill').focus();
		}
		else if (buzzword == ''){
			errorMessage.innerHTML = 'Please provide a buzzword.';
			document.querySelector('#buzzword').focus();
		}
		else if (emoji == ''){
			errorMessage.innerHTML = 'Please provide an emoji.';
			document.querySelector('#emoji').focus();
		}
		else{
            
            myText = `
            <p class="post-text">
                Feeling grateful and excited as I step into a new opportunity.
            </p>

            <p class="post-text">
                I'm <span>${adjective}</span> to share that I'll be <span>${verb}</span> as a
                <span>${jobTitle}</span> at <span>${companyName}</span> in the
                <span>${industry}</span> space.
            </p>

            <p class="post-text">
                Every step along the way has been a learning experience, and I’m thankful for the people who believed in me.
            </p>

            <p class="post-text">
                I can't wait to use my <span>${skill}</span> to help build real
                <span>${buzzword}</span> with an amazing team.
            </p>

            <p class="post-text">
                Excited to see where this journey leads.
            </p>

            <p class="post-text">
                Let's go! <span>${emoji}</span>
            </p>
            `;

			form.reset();
			errorMessage.innerHTML = '';
			madlib.innerHTML = myText;
			madlibOverlay.style.display = 'grid';
		}
	});

	closeBtn.addEventListener('click', function(event){
		event.preventDefault();
		madlibOverlay.style.display = 'none';
	});

	document.addEventListener('keydown', function(event){
        if (event.key === 'Escape'){
            madlibOverlay.style.display = 'none';
        }
        likeBtn.addEventListener('click', function(){
        likes++;
        likeCount.textContent = likes;
        likeBtn.classList.add('liked');
        });
	});
}());
