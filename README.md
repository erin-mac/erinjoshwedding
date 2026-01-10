# Wedding Website

A beautiful, responsive wedding website built with HTML, CSS, and JavaScript.

## Features

- **Home Page**: Welcome message and quick links to important sections
- **Schedule**: Detailed wedding weekend timeline with accommodations info
- **RSVP**: Google Form integration for guest responses
- **Registry**: Payment app links for honeymoon/home fund contributions
- **DC Guide**: Recommendations for restaurants, bars, museums, and things to do
- **Photos**: Engagement photo gallery with lightbox viewer
- **Mobile Responsive**: Works perfectly on all devices

## Getting Started

### Viewing Locally

Simply open `index.html` in your web browser to view the site locally.

### Customization Checklist

#### 1. Home Page (`index.html`)
- [ ] Replace `[Wedding Date]` with your actual wedding date
- [ ] Replace `[Wedding Location]` with your venue name
- [ ] Update the welcome message with your personal story

#### 2. RSVP Page (`rsvp.html`)
- [ ] Create your Google Form for RSVPs
- [ ] Get the embed code from Google Forms (Send > Embed HTML)
- [ ] Replace `YOUR_GOOGLE_FORM_EMBED_URL_HERE` with your form's embed URL
- [ ] Replace `YOUR_GOOGLE_FORM_DIRECT_URL_HERE` with the direct link to your form
- [ ] Update the RSVP deadline date
- [ ] Add your contact email and phone number

#### 3. Registry Page (`registry.html`)
- [ ] Update Venmo username and link
- [ ] Update Zelle email/phone
- [ ] Update PayPal username and link
- [ ] Update Cash App cashtag and link
- [ ] Customize the "What We're Saving For" section
- [ ] Add your honeymoon destination

#### 4. Schedule Page (`schedule.html`)
- [ ] Fill in all dates for Friday, Saturday, Sunday events
- [ ] Add venue names and addresses for all events
- [ ] Update hotel information (names, addresses, rates, booking codes)
- [ ] Update transportation details
- [ ] Specify indoor/outdoor ceremony location
- [ ] Update attire guidelines

#### 5. DC Guide (`dc-guide.html`)
- [ ] Replace placeholder restaurants with your favorites
- [ ] Add your favorite bars and nightlife spots
- [ ] Include your recommended coffee shops
- [ ] Update museum recommendations
- [ ] Add any additional neighborhoods you recommend
- [ ] Update travel tips for your wedding month/season

#### 6. Photos Page (`photos.html`)
- [ ] Add your engagement photos to the `images/` folder
- [ ] Replace the placeholder divs with `<img>` tags
- [ ] Use format: `<img src="images/engagement-1.jpg" alt="Description">`

#### 7. Global Updates
- [ ] Update "Our Wedding" brand name in navigation (all pages)
- [ ] Update footer text (all pages)
- [ ] Add your names throughout the site
- [ ] Customize colors in `css/styles.css` if desired

### Color Customization

To change the color scheme, edit the CSS variables in `css/styles.css`:

```css
:root {
    --primary-color: #8b7355;      /* Main brand color */
    --secondary-color: #d4a574;    /* Accent color */
    --accent-color: #f4e8d8;       /* Light accent */
    --text-dark: #333;             /* Dark text */
    --text-light: #666;            /* Light text */
}
```

### Adding Your Photos

1. Save your engagement photos in the `images/` folder
2. Name them sequentially (e.g., `engagement-1.jpg`, `engagement-2.jpg`, etc.)
3. In `photos.html`, replace the placeholder divs:

```html
<!-- Replace this: -->
<div class="photo-placeholder">📷</div>

<!-- With this: -->
<img src="images/engagement-1.jpg" alt="Engagement photo 1">
```

## Deployment Options

### Option 1: GitHub Pages (Free)
1. Create a GitHub account if you don't have one
2. Create a new repository named `wedding-website`
3. Upload all files to the repository
4. Go to Settings > Pages
5. Select "Deploy from branch" and choose "main"
6. Your site will be live at `https://yourusername.github.io/wedding-website`

### Option 2: Netlify (Free)
1. Sign up at [netlify.com](https://netlify.com)
2. Drag and drop your `wedding-website` folder
3. Your site will be live instantly with a custom URL
4. You can add a custom domain later

### Option 3: Vercel (Free)
1. Sign up at [vercel.com](https://vercel.com)
2. Import your project folder
3. Deploy with one click
4. Add a custom domain if desired

## Project Structure

```
wedding-website/
├── index.html          # Home page
├── rsvp.html          # RSVP with Google Form
├── registry.html      # Registry/funds page
├── schedule.html      # Wedding weekend schedule
├── dc-guide.html      # DC recommendations
├── photos.html        # Engagement photos
├── css/
│   └── styles.css     # All styling
├── js/
│   └── main.js        # Navigation and interactions
├── images/            # Your photos go here
└── README.md          # This file
```

## Browser Support

Works on all modern browsers:
- Chrome
- Firefox
- Safari
- Edge

## Questions or Issues?

Feel free to customize this website to match your wedding style and personality. Have fun with it!

## License

This template is free to use for your personal wedding website.
