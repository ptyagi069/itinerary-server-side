const config = require('../config/config');
const { getItineraryDetails } = require("../../controller-itinerary-detail/itineraryController");

async function getpkgInfo(pkgid) {
    try {
        // const apiurl = `${config.apiurl2}pkgdetail`;
        // const response = await fetch(apiurl, {
        //     method: 'POST',
        //     headers: {
        //         'Accept': '*/*',
        //         'Content-Type': 'application/json' 
        //     },
        //     body: JSON.stringify({
        //         pkgid: pkgid
        //     })
        // });
        // const data = await response.json();

        const data  = await getItineraryDetails({pkgid}, "pkgdetail");
      
        return {
            packageName: data[0]['PKG_TITLE'],
            pkg_noofdays: data[0]['PKG_NOOFDAY'],
            description: data[0]['PKG_DESCRIPTION'],
            depositamount: parseInt(data[0]['PKG_DEPOSIT_AMT']),
            activitycount: data[0]['activitycount'],
            hotel_list: data[0]['HotelList'],
            meals: data[0]['MealTypeCounts'],
            cityhighlights: data[0]['cityhighlights'],
            PKG_IMAGE: data[0]['PKG_IMAGE'],
            topexpriences : data[0]['TopExperiences'],
            youlllovethis : data[0]['SuitForTravellersType']

        };
    } catch (error) {
        throw new Error(`Failed to fetch package data: ${error.message}`);
    }
}

async function getHotelInfo(pkgid) {
    try {
        // const apiurl = `${config.apiurl2}pkgdetail`;
        // const response = await fetch(apiurl, {
        //     method: 'POST',
        //     headers: {
        //         'Accept': '*/*',
        //         'Content-Type': 'application/json' 
        //     },
        //     body: JSON.stringify({
        //         pkgid: pkgid
        //     })
        // });
        
        // const data = await response.json();

        const data  = await getItineraryDetails({pkgid},"hotel");
        if (!Array.isArray(data) || data.length === 0) {
            console.error('Invalid or empty data received from API');
            return [];
        }

        const hotelDetails = [];
        
        // data.forEach(pkg => {
            try {
                // const hotelList = JSON.parse(pkg.HotelList || '[]');
                data.forEach(hotel => {
                    
                    hotelDetails.push({
                        name: hotel.HTL_NAME || '',
                        starRating: hotel.HTL_STAR || '',
                        cityName: hotel.HTL_CITY_NAME || '',
                        imagePath: hotel.IMAGE_PATH || '',
                        nights: hotel.HTL_NIGHTS  || '',
                        hotelhighlights : hotel.Hotelhighlights || ''
                    });
                });
            } catch (e) {
                console.error('Error processing hotel list:', e);
            }
        // });

        return hotelDetails;
        
    } catch (error) {
        console.error('Error fetching hotel information:', error);
        throw new Error(`Failed to fetch hotel data: ${error.message}`);
    }
}

async function getpkginclusionexclusions(pkgid) {
    try {
        const apiurl = `${config.apiUrl}/Holidays/PacKageInclusionAndExclusion?PKG_ID=${pkgid}`;
        const response = await fetch(apiurl);
        const data = await response.json();

        return data.map(item => ({
            type: item['inC_TYPE'],
            details: item['inC_DETAILS']
        }));
    } catch (error) {
        throw new Error(`Failed to fetch package data: ${error.message}`);
    }
}

async function generateQr(agentId, emailId, packageId, tourDate, amount, depositAmount, ipAddress) {
    const url = `${config.apiUrl}/Account/GenrateQr`;
    const params = new URLSearchParams({
        agentid: agentId,
        emailid: emailId,
        packageid: packageId,
        tourdate: tourDate,
        Amount: amount,
        DepositAmount: depositAmount,
        ipaddress: ipAddress
    });
    
    try {
        const temp = await fetch(`${url}?${params.toString()}`, {
            method: 'POST',
            headers: {
                'Accept': '*/*'
            },
            body: ''
        });
        const response = await temp.json();
        return {
            success: response.success,
            message: response.message,
            ...(response.success === 'false' && { details: response })
        };
    } catch (error) {
        throw new Error(`Failed to generate QR: ${error.message}`);
    }
}

async function getpkgitineray(pkgid, userid) {
    const a = `${config.apiurl2}itinerary`;
    try {
        // const temp = await fetch(`${a}`, {
        //     method: 'POST',
        //     headers: {
        //         'Accept': '*/*',
        //         'Content-Type': 'application/json' 
        //     },
        //     body: JSON.stringify({
        //         pkgid,
        //         userid
        //     })
        // });

        // const result = await temp.json();
        const result  = await getItineraryDetails({pkgid, userid}, "itinerary");
        return result.map((day) => ({
            day: day['PKG_ITI_DAY'],
            title: day['PKG_ITI_TITLE'],
            description: day['PKG_ITI_DESC'],
            details: day['ItineraryDetails'],
            addons : day['AddonsList']
        }));
    } catch (error) {
        throw new Error(`Failed to fetch itinerary: ${error.message}`);
    }
}

async function getagencyprofiledetails(userid) {
    try {
        const apiurl = `${config.apiUrl}/Account/GetAgencyProfileDetails?AgentID=${userid}`;
        const response = await fetch(apiurl);
        const data = await response.json();
        
        return {
            emailId: data['emailid'],
            companyLogo: data['companyLogo'],
            contact: data['contact'],
            whatsappNumber: data['whatsappNumber'],
            company_Name : data['company_Name']
        };
    } catch (error) {
        throw new Error(`Failed to fetch agency profile details: ${error.message}`);
    }
}

async function getpkgrates(pkgid , userid , tourdate){
    try {
        const apiurl = `${config.apiUrl}/Holidays/PacKageRate?PKG_ID=${pkgid}&AgentID=${userid}&tourdate=${tourdate}`;
        const response = await fetch(apiurl);
        const data = await response.json();
        return {
            dbldclienT_PRICE : data[0]['dbldclienT_PRICE'],
            singdclienT_PRICE : data[0]['singdclienT_PRICE'],
            ratE_AVIAL_DATE_R : data[0]['ratE_AVIAL_DATE_R'],
        }
       
    } catch (error) {
        throw new Error(`Failed to fetch package data: ${error.message}`);
    }
}

class PackageService {    
    async getPackageData(pkgid, userid , tourdate) {
        try {
            const result = {};
            result.pkgdate = tourdate;
            result.packageInfo = await getpkgInfo(pkgid);
            result.agencyProfile = await getagencyprofiledetails(userid);
            result.inclusionsExclusions = await getpkginclusionexclusions(pkgid);
            result.hoteldetails = await getHotelInfo(pkgid);
            result.itinerary = await getpkgitineray(pkgid, userid);
            result.packagerates = await getpkgrates(pkgid , userid , tourdate);
            result.qr = await generateQr(userid, result.agencyProfile.emailId, pkgid, tourdate, result.packageInfo.depositamount, result.packageInfo.depositamount, '1.1.1.1');
           return result;
        } catch (error) {
            throw new Error(`Failed to fetch complete package data: ${error.message}`);
        }
    }
}

module.exports = new PackageService();