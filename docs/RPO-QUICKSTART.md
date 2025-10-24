# RPO Recruitment Hub - Quick Start Guide

Get started with the RPO Recruitment Hub skin in minutes and streamline your hiring process.

## Table of Contents

- [Overview](#overview)
- [Activating the RPO Skin](#activating-the-rpo-skin)
- [Component Guide](#component-guide)
- [Common Workflows](#common-workflows)
- [Tips & Best Practices](#tips--best-practices)
- [Troubleshooting](#troubleshooting)

## Overview

The **RPO Recruitment Hub** is a comprehensive workspace designed for recruitment professionals. It combines all essential recruitment tools in one unified interface:

- 📊 **Candidate Pipeline** - Track candidates through stages
- 💼 **Indeed Integration** - Source new candidates
- 💬 **Google Messages** - Communicate with candidates
- 📹 **Zoom** - Schedule and conduct video interviews
- 📅 **Calendly** - Automated interview scheduling

## Activating the RPO Skin

### Method 1: Use the Template

1. Navigate to **Skins** (`/skins`) in the main menu
2. Find **"RPO Recruitment Hub"** in the template list
3. Click **"Activate"** button
4. Click **"Open"** or navigate to **Workspace** (`/workspace`)

### Method 2: Create from Scratch

1. Go to **Skin Builder** (`/skins/builder`)
2. Name your skin (e.g., "My Recruitment Workspace")
3. Go to the **Components** tab
4. Add these components:
   - Spreadsheet
   - Indeed Integration
   - Google Messages
   - Zoom Meetings
   - Calendly Scheduler
5. Arrange them in your preferred layout
6. Click **"Save Skin"**

## Component Guide

### 1. Candidate Pipeline (Spreadsheet)

**Location**: Large area on the left side

#### Getting Started

**Upload Candidates from CSV/Excel:**
1. Click **"📤 Upload CSV"** button
2. Select your candidate CSV file
3. Candidates will automatically populate the grid

**CSV Format Example:**
```csv
Name,Email,Phone,Position,Stage,Source,Date Applied,Notes
John Doe,john@example.com,555-0100,Software Engineer,New,Indeed,2025-10-20,Strong Python skills
Jane Smith,jane@example.com,555-0101,Product Manager,Screening,LinkedIn,2025-10-21,5 years experience
```

**Manual Entry:**
1. Click **"➕ Add Candidate"**
2. Fill in candidate details directly in the grid
3. Click cells to edit inline

#### Pipeline Stages

Default stages (customizable):
- 🔵 **New** - Just received
- 🟡 **Screening** - Initial review
- 🟣 **Phone Screen** - Phone interview scheduled
- 🟣 **Technical Interview** - Technical assessment
- 🟣 **Final Interview** - Final round
- 🟢 **Offer** - Offer extended
- 🟢 **Hired** - Candidate accepted
- 🔴 **Rejected** - Not moving forward

**Change Stage:**
- Click the stage dropdown in any row
- Select new stage
- Pipeline stats update automatically

#### Export Data

1. Click **"📥 Export CSV"**
2. File downloads with format: `candidates_YYYY-MM-DD.csv`
3. Open in Excel or import to other systems

### 2. Indeed Integration

**Location**: Top-right area

#### Views

**Candidates View** (Default):
- Browse applications from Indeed
- See match scores (e.g., 95% match)
- Quick actions: View Resume, Contact

**Jobs View**:
- See your active job postings
- Track application counts
- Monitor posting status

**Analytics View**:
- Total applications
- Interviews scheduled
- Job views
- Application rate

#### Configuration

To connect your Indeed account:
1. Go to Skin Builder
2. Edit the Indeed component
3. Add your **Company ID**
4. Save changes

### 3. Google Messages

**Location**: Bottom-left

#### Features

- **Conversation List**: All candidate conversations
- **Unread Indicators**: Blue badges show unread count
- **Message Threading**: Full conversation history
- **Send Messages**: Type and click Send

#### Usage

1. Click a conversation to open
2. View message history
3. Type your message at the bottom
4. Press **Enter** or click **Send**

### 4. Zoom Meetings

**Location**: Bottom-center

#### Schedule an Interview

1. Click **"Schedule"** view
2. Fill in meeting details:
   - Meeting title (e.g., "Interview: John Doe")
   - Date and time
   - Duration (30/45/60 minutes)
   - Attendee email
3. Click **"Create Zoom Meeting"**
4. Meeting link automatically sent to candidate

#### View Upcoming Meetings

1. Click **"Upcoming"** view
2. See all scheduled interviews
3. Actions:
   - **Join Meeting** - Start the interview
   - **Copy Link** - Share with others
   - **Edit** - Modify details

#### Access Past Meetings

1. Click **"Past"** view
2. View completed interviews
3. **▶ Watch Recording** - Review interview
4. **Download** - Save locally

### 5. Calendly Integration

**Location**: Bottom-right

#### Setup

1. Edit the Calendly component
2. Enter your **Calendly username** or **full URL**
3. Optional: Specify **event type** (e.g., "30min", "technical-interview")

#### Usage

Candidates can:
- View your availability
- Select a time slot
- Book directly
- Receive automatic confirmation

**Perfect for**: Letting candidates self-schedule initial screenings

## Common Workflows

### Workflow 1: Adding New Candidates

```
1. Upload CSV from Indeed/LinkedIn
   ↓
2. Review in spreadsheet, update stages
   ↓
3. Send message via Google Messages
   ↓
4. Schedule interview via Calendly or Zoom
   ↓
5. Move to next stage after interview
```

### Workflow 2: Screening Process

```
1. Candidate in "New" stage
   ↓
2. Review resume in Indeed component
   ↓
3. Move to "Screening" stage
   ↓
4. Send screening questions via Messages
   ↓
5. Schedule phone screen in Zoom
   ↓
6. Update notes in spreadsheet
```

### Workflow 3: Interview Scheduling

```
1. Candidate ready for interview
   ↓
2. Move to "Phone Screen" or "Technical Interview" stage
   ↓
3. Option A: Send Calendly link (self-schedule)
   Option B: Schedule Zoom meeting manually
   ↓
4. Add meeting link to spreadsheet notes
   ↓
5. Candidate receives notification
```

### Workflow 4: Daily Review

```
Morning:
- Check Indeed for new applications → Add to spreadsheet
- Review Google Messages → Respond to candidates
- Check Zoom upcoming → Prepare for interviews

Throughout Day:
- Conduct interviews via Zoom
- Update pipeline stages in real-time
- Send follow-up messages

End of Day:
- Export CSV for backup
- Update offer/rejection statuses
- Schedule tomorrow's interviews
```

## Tips & Best Practices

### Spreadsheet Organization

✅ **Do:**
- Update stages immediately after interviews
- Add detailed notes for each interaction
- Use consistent date format
- Export backups regularly (weekly recommended)

❌ **Don't:**
- Leave candidates in wrong stages
- Skip the notes field
- Delete candidates (move to "Rejected" instead)

### Communication

✅ **Do:**
- Respond to messages within 24 hours
- Keep communication professional
- Save templates for common messages
- Log all communication in notes

❌ **Don't:**
- Use Google Messages for sensitive information
- Forget to follow up after interviews
- Send generic, impersonal messages

### Interview Scheduling

✅ **Do:**
- Send calendar invites 2-3 days in advance
- Include agenda in meeting description
- Test Zoom link before interviews
- Record important interviews (with permission)

❌ **Don't:**
- Schedule back-to-back interviews without breaks
- Forget to send confirmation emails
- Double-book time slots

### Pipeline Management

✅ **Do:**
- Review pipeline daily
- Keep stages updated
- Track time-in-stage metrics
- Set reminders for follow-ups

❌ **Don't:**
- Let candidates sit in stages too long
- Skip stages inappropriately
- Forget to update after decisions

## Troubleshooting

### CSV Upload Issues

**Problem**: CSV not parsing correctly

**Solutions:**
- Ensure first row contains headers
- Use commas as delimiters (not semicolons)
- Remove special characters from names
- Check for extra blank rows at the end
- Verify column names match expected format

### Integration Not Working

**Problem**: Indeed/Calendly/Zoom not loading

**Solutions:**
- **Indeed**: Verify Company ID is correct
- **Calendly**: Check username spelling, try full URL
- **Zoom**: Ensure meeting ID is valid
- **All**: Check internet connection
- **All**: Refresh the workspace page

### Stage Dropdown Not Updating

**Problem**: Stage changes not saving

**Solutions:**
- Ensure spreadsheet is in edit mode (editable: true)
- Try clicking away from the cell after selecting
- Refresh the page and try again
- Check browser console for errors

### Export Not Working

**Problem**: CSV export button does nothing

**Solutions:**
- Ensure there's data in the spreadsheet
- Check browser's download settings
- Try a different browser
- Clear browser cache

### Messages Not Sending

**Problem**: Google Messages not sending

**Solutions:**
- Check message is not empty
- Verify conversation is selected
- Refresh the component
- Check browser permissions

## Getting Help

### Documentation

- **Full Skin Guide**: [docs/SKINS.md](../docs/SKINS.md)
- **Component Reference**: [docs/COMPONENTS.md](../docs/COMPONENTS.md)
- **API Integration**: [docs/API-INTEGRATION.md](../docs/API-INTEGRATION.md)

### Support

- Open an issue on GitHub
- Check existing issues for solutions
- Review the changelog for recent updates

## Next Steps

### Beginner

1. ✅ Activate the RPO template
2. ✅ Upload your first candidate CSV
3. ✅ Practice updating stages
4. ✅ Schedule a test Zoom meeting

### Intermediate

1. Configure Indeed integration
2. Set up Calendly with your account
3. Create custom pipeline stages
4. Export and analyze your data

### Advanced

1. Customize the skin layout
2. Add additional components
3. Create multiple recruitment skins for different roles
4. Integrate with real APIs (see API-INTEGRATION.md)

## Quick Reference Card

| Task | Component | Action |
|------|-----------|--------|
| Add candidates | Spreadsheet | Upload CSV or Add manually |
| Update stage | Spreadsheet | Click stage dropdown |
| Export data | Spreadsheet | Click Export CSV |
| View applications | Indeed | Switch to Candidates view |
| Message candidate | Google Messages | Select conversation, type, send |
| Schedule interview | Zoom | Schedule view → Fill form |
| Self-schedule | Calendly | Share your Calendly URL |
| Join interview | Zoom | Upcoming → Join Meeting |
| View recording | Zoom | Past → Watch Recording |

---

**Happy Recruiting! 🎉**

Need more help? Check the [full documentation](../docs/SKINS.md) or open an issue on GitHub.
