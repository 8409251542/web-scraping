const axios = require('axios');
const cheerio = require('cheerio');
const xlsx = require('xlsx');
const fs = require('fs');

async function getInternshipData() {
    try {
        const { data: HTML } = await axios.get('https://internshala.com/jobs/');
        const $ = cheerio.load(HTML);

        const jobs = [];

        $('.individual_internship').each((i, job) => {
            const jobTitle = $(job).find('.job-internship-name').text().trim();
            const company = $(job).find('.company-name').text().trim();
            const location = $(job).find('.locations a').text().trim();
            const experience = $(job).find('.item_body').text().trim();
            const salary = $(job).find('.desktop').text().trim();

            const jobData = {
                jobTitle,
                company,
                location,
                experience,
                salary
            };

            jobs.push(jobData);
        });

        // Create a new workbook and worksheet
        const workbook = xlsx.utils.book_new();
        const worksheet = xlsx.utils.json_to_sheet(jobs);

        // Append the worksheet to the workbook
        xlsx.utils.book_append_sheet(workbook, worksheet, 'Internships');

        // Write the workbook to a file
        xlsx.writeFile(workbook, 'Internships.xlsx');

        console.log('Excel file created successfully!');
    } catch (error) {
        console.error('Error fetching data:', error.message);
    }
}

getInternshipData();
