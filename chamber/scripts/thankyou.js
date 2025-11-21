document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const summaryContainer = document.getElementById('summary');
    const summaryList = document.createElement('ul');

    const labelMap = {
        fname: "First Name",
        lname: "Last Name",
        title: "Job Title",
        email: "Email Address",
        phone: "Mobile Phone",
        bizname: "Business Name",
        membership: "Membership Level",
        description: "Business Description",
        timestamp: "Application Submitted"
    };

    params.forEach((value, key) => {
        if (!value) {
            return;
        }

        const listItem = document.createElement('li');

        const formattedKey = labelMap[key] || key.charAt(0).toUpperCase() + key.slice(1);

        let formattedValue = value;

        if (key === 'timestamp') {
            const date = new Date(value);

            // localize formatting
            formattedValue = new Intl.DateTimeFormat('en-US', {
                dateStyle: 'long',
                timeStyle: 'short'
            }).format(date);
        }


        if (key === 'membership' && value === 'np') {
            formattedValue = 'Non-Profit';
        } else if (key === 'membership') {
            formattedValue = value.charAt(0).toUpperCase() + value.slice(1);
        }

        listItem.innerHTML = `<strong>${formattedKey}:</strong> ${formattedValue}`;
        summaryList.appendChild(listItem);
    });

    summaryContainer.appendChild(summaryList);
});