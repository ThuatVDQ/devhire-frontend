// src/data/emailTemplates.js

export const emailTemplates = [
  {
    id: 1,
    subject: 'Congratulations on Passing the Initial Screening for the {jobTitle} Position',
    body: `Dear {candidateName},
  
We are pleased to inform you that, after reviewing your application, you have successfully passed the initial screening for the {jobTitle} position at [Company Name]. We were impressed with your qualifications and believe you may be a great fit for our team.
  
  **Next Steps:**  
  Our recruitment team will reach out soon to schedule an interview or assessment to learn more about your skills and how you could contribute to our team. In the meantime, please feel free to reach out to us if you have any questions.
  
  Thank you for your interest in joining us. We look forward to speaking with you soon!
  
  Best regards,  
  [Recruitment Team]  
  [Company Name]  
  [Contact Information]`
  },
  {
    id: 2,
    subject: 'Interview Invitation for the {jobTitle} Position at [Company Name]',
    body: `Hello {candidateName},
  
We are excited to invite you to an in-person interview for the {jobTitle} position at [Company Name]. We believe that your skills and experience align well with our requirements, and we would love the opportunity to get to know you better.
  
  **Interview Details:**  
  - **Date:** [Insert Date]  
  - **Time:** [Insert Time]  
  - **Location:** [Insert Address of the Company’s Office]
  
  Please confirm if this time works for you, or let us know if you need to reschedule. We look forward to an engaging discussion and learning more about how you could contribute to our team.
  
  Warm regards,  
  [Recruitment Team]  
  [Company Name]  
  [Contact Information]`
  },
  {
    id: 3,
    subject: 'Online Interview Invitation for the {jobTitle} Position at [Company Name]',
    body: `Hello {candidateName},
  
We are excited to invite you to a virtual interview for the {jobTitle} position at [Company Name]. Your qualifications and experiences caught our attention, and we’re looking forward to learning more about you.
  
  **Interview Details:**  
  - **Date:** [Insert Date]  
  - **Time:** [Insert Time]  
  - **Platform:** [Insert Video Platform Link, e.g., Zoom, Google Meet]
  
  Please confirm if this time works for you, or let us know if you need to reschedule. We look forward to our conversation!
  
  Warm regards,  
  [Recruitment Team]  
  [Company Name]  
  [Contact Information]`
  },
  {
    id: 4,
    subject: 'Skills Assessment for the {jobTitle} Position at [Company Name]',
    body: `Hello {candidateName},
  
Thank you for your interest in the {jobTitle} position at [Company Name]. As part of our hiring process, we would like to invite you to complete a skills assessment to better understand your technical abilities and suitability for this role.
  
  **Assessment Details:**  
  - **Format:** Online test  
  - **Duration:** Approximately [Insert Duration, e.g., 60 minutes]  
  - **Platform:** [Insert Link to Assessment Platform, e.g., Codility, HackerRank]
  
  The assessment link will be active from [Start Date and Time] to [End Date and Time]. Please complete the assessment within this time frame. Let us know if you need any accommodations or adjustments.
  
  Best of luck, and we look forward to reviewing your results!
  
  Best regards,  
  [Recruitment Team]  
  [Company Name]  
  [Contact Information]`
  }
]
