export const mockTemplates = Array(20)
    .fill({})
    .map((_, index) => ({
        templateId: index + 1,
        templateName: `Template ${index}`,
        description: `Template ${index} description`, 
        placeholders: [
            "Role",
            "Company",
            "Location",
            "Salary"
        ]
    }));

export const mockJobOffersDetails = Array(20)
    .fill({})
    .map((_, index) => ({
        templateId: index,
        templateName: `Template ${index}`,
        description: `Templates ${index} description`,
        placeholders: {
            Role: `Role ${index}`,
            Company: `Company ${index}`,
            Location: `Location ${index}`,
            Salary: `Salary ${index}`,
        } as object,
    }));


export const mockJobOffersOverview = Array(20)
   .fill({})
   .map((_, index) => ({
        jobId: index + 1,
        companyName: `Company ${index}`,
        jobTitle: `Job ${index}`,
        companyId: index + 1,
        dateRecieved: new Date(),
        status: index == 1? "Rejected" : "Pending",
        city: `city ${index}`,
        country: `country ${index}`,
   }))