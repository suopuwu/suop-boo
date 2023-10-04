document.addEventListener('DOMContentLoaded', () => {
    let infoSections = [
        {
            title: 'Big Brain Notes',
            skills: [
                'UX / UI Design',
                'Flutter',
                'Dart',
                'Firebase',
                'Html',
                'Sass / css',
                'Javascript',
                'Python',
            ],
            paragraphs: [
                `<img class="lightbox-target" src="img/bbn1.png"> For nearly as long as I can remember, I've played Smash Bros. It was in middle school that I got serious about it and started entering tournaments. Throughout my time competing, I would study gameplay to try and improve as much as possible. This helped, but I always felt like I would forget the lessons I learned. That's why I made Big Brain Notes. Though a normal note taking app might work, they often didn't support images, and they were not organized for my specific use case.`,
                `I started by opening a notebook and writing down all the things that I would want a notes app to do. After that, I drew mockups of the various screens and how they would flow together. Throughout the process, I was laser focused on creating a good experience: quite literally an app I would want to use. I had to learn Flutter from scratch. It was a difficult process, as this was the first big project that I had ever undertaken. Despite that, the hundreds of hours spent learning and programming were worth it. Not only did the app get rave reviews online, it also helped me get ranked number one in my state for a time.`,
                `There are two versions: a mobile and a web version. The web version is incomplete, but it still served as a valuable project to learn how to use firebase. The mobile version currently has a 4.9 star rating on the Google Play store. Here are some reviews:`,
                `Fantastic tool for pros and amatuers looking to improve their matchup game. FIXED WHITE SCREEN GLITCH. I had this issue and I just emailed the creator and they were super helpful and got back to me very quickly! They had fixed the issue by the next day! App is super useful and really well put together! Exactly what I needed. A requirement for any serious competitor!`,
            ],
        },
        {
            title: 'Craigharline.com',
            skills: [
                'UI design',
                'Wordpress themes / plugins',
                'Figma',
                'Html',
                'Sass / css',
                'Javascript',
            ],
            paragraphs: [
                `<img class="lightbox-target" src="img/ch1.png"> A professor at my university had a personal website in Wordpress that he wanted to give a makeover. Over the course of a few months, we did a lot of work on the website through a few in person meetings and around 300 emails. I started by making mockups in Figma until he found one that he liked. With that done, I developed the theme and plugins necessary for the functionality he wanted. After that, we went through smaller tweaks to the website, until he was satisfied. Throughout the process, I made sure to communicate clearly and to his satisfaction, and it seems to have worked. In one of our last communications, he said "I’m really happy with the website, thanks for all your work and answering and fixing my many questions."`,
                `You can see the website at <a href="https://craigharline.com">Craigharline.com</a>, though note that there's only so much you can do to improve the speed of a website hosted on a 50 dollar per year plan.`,
            ],
        },
        {
            title: 'SuopCommerce',
            skills: [
                'C#',
                'Razor Pages',
                'RESTful APIs',
                'Authentication',
                'Postgres',
                'Sass / css',
                'Javascript',
                'SQL',
            ],
            paragraphs: [
                `<img class="lightbox-target" src="img/sc1.png"> This was a project I made for my father. He runs a one-man company that makes nursery signs for new parents. Like many other handmade goods companies, it got its start on Etsy. Unfortunately, Etsy's policies gradually grew more and more hostile to its sellers over time. As such, My father had me make an ecommerce website to replace his Etsy shop. Written using Asp.net with Razor Pages and EF Core, it's a simple storefront that uses stripe to process payments.`,
                `I hadn't ever undertaken a project in C# before, but I dove into development. I gained valuable experience using all the technologies involved, from Azure services to Postgres. My father didn't want to edit the code himself, so I made an admin page with ui for adding products.`,
                `The website is not available due to unrelated reasons, but the code is available on <a href="https://github.com/suopuwu/suopCommerce">Github</a>.`,
            ],
        },
        {
            title: 'Snackbar and Popup Libraries',
            skills: ['Javascript', 'Sass / css', 'UX'],
            paragraphs: [
                `<img class="lightbox-target" src="img/fel1.png"> These are two frontend libraries that I am quite happy with. One allows you to create android style snackbars, and the other lets you create popups / lightboxes. In fact, the images on this website create a lightbox using SuopPopup.js when clicked. Designed to be as simple to use as possible, you just have to put the scripts on your website to use them. Over the course of making these, I spent hours tinkering with minor ui changes. The end result is that they feel smooth to use. Here, <a href="javascript:SuopSnack.add('I\\'m a snackbar!')">try it out</a>. Adding multiple simultaneous snackbars is gracefully animated, as you can see. Snackbars are also highly customizable. You can change the lifespan and the buttons available easily, <a href="javascript:SuopSnack.add('Here are some extra buttons to push', 10000, [new SuopSnack.Action('First', ()=>{SuopSnack.add('First pressed.')}, 'teal'), new SuopSnack.Action('Second', ()=>{SuopSnack.add('Second pressed.')}, 'deeppink')], false)">like so</a>.`,
            ],
        },
        {
            title: 'Bite Sized Projects',
            skills: ['Javascript', 'Sass / css', 'Node.js'],
            paragraphs: [
                `<h2>Totally Original Platformer</h2>
                TODO`,
            ],
        },
        {
            title: 'Education',
            skills: [
                'Java',
                'C',
                'C#',
                'Data structures',
                'Algorithms',
                'Discrete computing',
            ],
            paragraphs: [
                `I am currently working towards a bachelor's degree in software engineering, with an art minor at BYU.`,
            ],
        },
    ]

    let containers = [
        document.querySelector('#info-column-one'),
        document.querySelector('#info-column-two'),
    ]
    let counter = 0
    for (let section of infoSections) {
        let newNode = document.createElement('label')
        containers[counter % containers.length].append(newNode)
        newNode.outerHTML = createSectionHtml(
            section.title,
            section.skills,
            section.images,
            section.paragraphs
        )
        counter++
    }
})

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('lightbox-target')) {
        let lightbox = new SuopPopup(
            `<div style="line-height: 0; font-size: 0"><img src="${e.target.src}"></div>`
        )
        lightbox.showPopup()
    }
})
function createSectionHtml(title, skills, images, paragraphs) {
    function createSkillsHtml(skills) {
        let returnString = ''
        for (let skill of skills) {
            returnString += `<span class="skill">${skill}</span>`
        }
        return returnString
    }

    function createParagraphsHtml(paragraphs) {
        let returnString = ''
        for (let paragraph of paragraphs) {
            returnString += `<p>${paragraph}</p>`
        }
        return returnString
    }

    return `
    <div class="info-section">
        <label class="info-label">
            <input type="checkbox" name="open-section">
            <h1>${title}</h1>
            <span class="skills-list">
                ${createSkillsHtml(skills)}
            </span>
        </label>
        <div class="info-content-wrapper">
            <div class="info-content">
                ${createParagraphsHtml(paragraphs)}
            </div>
        </div>
    </div>
    `
}
