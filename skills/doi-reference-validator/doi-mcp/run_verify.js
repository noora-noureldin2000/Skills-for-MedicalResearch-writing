import * as fs from 'fs';

const citations = [
  {
    id: "Wang-2025",
    doi: "10.1007/s10143-025-03453-w",
    title: "Clinical and radiological outcomes of titanium cage versus polyetheretherketone cage in lumbar interbody fusion: a systematic review and meta-analysis",
    authors: ["Haozhong Wang", "Hao Zhang"],
    year: 2025,
    journal: "Neurosurgical Review"
  },
  {
    id: "Liu-2025",
    doi: "10.3390/jcm14061813",
    title: "Radiographic and Clinical Comparison of Polyetheretherketone Versus 3D-Printed Titanium Cages in Lumbar Interbody Fusion—A Single Institution's Experience",
    authors: ["D Liu", "JL Chan"],
    year: 2025,
    journal: "Journal of Clinical Medicine"
  },
  {
    id: "Takebayashi-2025",
    doi: "10.7759/cureus.77485",
    title: "Verification of the Cage Stability and the Superiority of Titanium Coating in the Bone Fusion of Transforaminal Lumbar Interbody Fusion Using Polyetheretherketone Cages",
    authors: ["Kazutaka Masamoto", "Shimei Tanida", "Bungo Otsuki", "Shunsuke Fujibayashi"],
    year: 2025,
    journal: "Cureus"
  },
  {
    id: "Levy-2025",
    doi: "10.1177/21925682251339998",
    title: "Do Three-Dimensional Printed Porous Titanium Relative to Polyetheretherketone Interbody Cages Reduce Complications and Revisions after Transforaminal Lumbar Interbody Fusion?",
    authors: ["Hannah A. Levy", "Abdelrahman M. Hamouda"],
    year: 2025,
    journal: "Global Spine Journal"
  },
  {
    id: "Mariscal-2025",
    doi: "10.1177/21925682251336716",
    title: "Titanium-Coated Polyetheretherketone Cages Versus Uncoated Polyetheretherketone Cages for Lumbar Spinal Fusion: A Systematic Review and Meta-Analysis",
    authors: ["Gonzalo Mariscal", "Praveer S. Vyas"],
    year: 2025,
    journal: "Global Spine Journal"
  },
  {
    id: "Ashby-2025",
    doi: "10.7759/cureus.85080",
    title: "Rates of Adjacent Segment Disease in Polyetheretherketone Versus Titanium Rods After Posterior Lumbar Fusion: A Systematic Review and Meta-Analysis",
    authors: ["Landon S. Ashby", "Nicolas K. Goff"],
    year: 2025,
    journal: "Cureus"
  },
  {
    id: "Ali-2024",
    doi: "10.12669/pjms.40.8.8759",
    title: "An analysis of clinical application effects of 3d-printed act titanium trabecular intervertebral fusion cage in posterior lumbar interbody fusion (PLIF)",
    authors: ["Zhijun Li", "Hong Wang"],
    year: 2024,
    journal: "Pakistan Journal of Medical Sciences"
  },
  {
    id: "Zhao-2024",
    doi: "10.1097/md.0000000000038431",
    title: "The postoperative clinical effects of utilizing 3D printed (Ti6Al4V) interbody fusion cages in posterior lumbar fusion: A retrospective cohort study",
    authors: ["Zi Wang", "Dongzhe Zhang"],
    year: 2024,
    journal: "Medicine"
  },
  {
    id: "Weinberg-2025",
    doi: "10.1177/21925682251347528",
    title: "Lumbar Fusion With Micro- & Nano-Textured, 3D Printed Porous Titanium Versus PEEK Interbody Cages in TLIF: A Single-Blinded, Randomized Controlled Trial",
    authors: ["Joshua H. Weinberg", "Nathan Ritchey"],
    year: 2025,
    journal: "Global Spine Journal"
  },
  {
    id: "Kim-2025",
    doi: "10.14444/8788",
    title: "Use of Double Cages for Biportal Endoscopic Transforaminal Lumbar Interbody Fusion: A Comparison of 3-Dimensional-Printed Titanium and Polyetheretherketone Cages",
    authors: ["Dong Hyun Lee", "Jin Young Lee"],
    year: 2025,
    journal: "International Journal of Spine Surgery"
  },
  {
    id: "Seaman-2017",
    doi: "10.1016/j.jocn.2017.06.062",
    title: "Titanium vs. polyetheretherketone (PEEK) interbody fusion: Meta-analysis and review of the literature",
    authors: ["Scott Seaman", "Panagiotis Kerezoudis", "Mohamad Bydon"],
    year: 2017,
    journal: "Journal of Clinical Neuroscience"
  },
  {
    id: "Schomacher-2014",
    doi: "10.1016/j.clineuro.2014.09.027",
    title: "Application of titanium and polyetheretherketone cages in the treatment of pyogenic spondylodiscitis",
    authors: ["Markus Schomacher", "Tobias Finger"],
    year: 2014,
    journal: "Clinical Neurology and Neurosurgery"
  },
  {
    id: "Cabraja-2012",
    doi: "10.1186/1471-2474-13-172",
    title: "Anterior cervical discectomy and fusion: comparison of titanium and polyetheretherketone cages",
    authors: ["Mario Cabraja", "Soner Oezdemir"],
    year: 2012,
    journal: "BMC Musculoskeletal Disorders"
  },
  {
    id: "Chen-2013",
    doi: "10.1007/s00586-013-2772-y",
    title: "Comparison of titanium and polyetheretherketone (PEEK) cages in the surgical treatment of multilevel cervical spondylotic myelopathy: a prospective, randomized, control study with over 7-year follow-up",
    authors: ["Yu Chen", "Xinwei Wang"],
    year: 2013,
    journal: "European Spine Journal"
  },
  {
    id: "Vadapalli-2006",
    doi: "10.1097/01.brs.0000250177.84168.ba",
    title: "Biomechanical rationale for using polyetheretherketone (PEEK) spacers for lumbar interbody fusion—a finite element study",
    authors: ["Sasidhar Vadapalli", "Vijay K. Goel"],
    year: 2006,
    journal: "Spine"
  },
  {
    id: "Rao-2014",
    doi: "10.1111/os.12098",
    title: "Spine interbody implants: material selection and modification, functionalization and bioactivation of surfaces to improve osseointegration",
    authors: ["Prashanth J. Rao", "Matthew H. Pelletier"],
    year: 2014,
    journal: "Orthopaedic Surgery"
  },
  {
    id: "Junaid-2018",
    doi: "10.12669/pjms.346.15833",
    title: "Radiological and clinical outcomes in patients undergoing anterior cervical discectomy and fusion: comparing titanium and PEEK (polyetheretherketone) cages",
    authors: ["Muhammad Junaid", "Mamoon Ur Rashid"],
    year: 2018,
    journal: "Pakistan Journal of Medical Sciences"
  },
  {
    id: "Cuzzocrea-2019",
    doi: "10.1007/s12306-018-0580-6",
    title: "PEEK versus metal cages in posterior lumbar interbody fusion: a clinical and radiological comparative study",
    authors: ["Francesco Cuzzocrea", "Alessandro Ivone"],
    year: 2019,
    journal: "Musculoskeletal Surgery"
  }
];

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchWithRetry(url, options = {}, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, options);
      if (res.ok) return res;
      if (res.status === 404) return null; // don't retry 404
      console.log(`Warning: HTTP ${res.status} for ${url}, retrying... (${i + 1}/${retries})`);
    } catch (err) {
      console.log(`Warning: Request failed for ${url}: ${err.message}, retrying... (${i + 1}/${retries})`);
    }
    await delay(1000 * (i + 1));
  }
  return null;
}

async function verifyDoiCrossRef(doi) {
  const cleanDoi = doi.replace(/^(https?:\/\/)?(dx\.)?doi\.org\//, '').trim();
  const url = `https://api.crossref.org/works/${cleanDoi}`;
  try {
    const res = await fetchWithRetry(url, {
      headers: {
        'User-Agent': 'DOIValidator/1.0 (mailto:research@example.com)'
      }
    });
    if (!res) return null;
    const data = await res.json();
    const message = data.message;
    return {
      source: 'CrossRef',
      title: Array.isArray(message.title) ? message.title[0] : message.title,
      authors: message.author?.map(a => `${a.given || ''} ${a.family || ''}`.trim()),
      year: message.published?.['date-parts']?.[0]?.[0] || message.issued?.['date-parts']?.[0]?.[0],
      doi: message.DOI,
      journal: Array.isArray(message['container-title']) ? message['container-title'][0] : message['container-title'],
      volume: message.volume,
      issue: message.issue,
      page: message.page
    };
  } catch (err) {
    return null;
  }
}

async function verifyDoiPubMed(doi) {
  const cleanDoi = doi.replace(/^(https?:\/\/)?(dx\.)?doi\.org\//, '').trim();
  const searchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${cleanDoi}&retmode=json`;
  try {
    const searchRes = await fetchWithRetry(searchUrl);
    if (!searchRes) return null;
    const searchData = await searchRes.json();
    const pmids = searchData.esearchresult.idlist;
    if (!pmids || pmids.length === 0) return null;
    
    const pmid = pmids[0];
    const summaryUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=${pmid}&retmode=json`;
    const summaryRes = await fetchWithRetry(summaryUrl);
    if (!summaryRes) return null;
    const summaryData = await summaryRes.json();
    const result = summaryData.result[pmid];
    
    return {
      source: 'PubMed',
      title: result.title,
      authors: result.authors?.map(a => a.name),
      year: parseInt(result.pubdate),
      doi: cleanDoi,
      journal: result.source,
      volume: result.volume,
      issue: result.issue,
      page: result.pages
    };
  } catch (err) {
    return null;
  }
}

async function verifySingle(citation, index) {
  // Add throttling: delay start based on index
  await delay(index * 250);
  
  const citationId = citation.id;
  console.log(`Verifying: ${citationId} (DOI: ${citation.doi})...`);
  
  // Try CrossRef
  let paper = await verifyDoiCrossRef(citation.doi);
  
  // Fallback to PubMed
  if (!paper) {
    paper = await verifyDoiPubMed(citation.doi);
  }
  
  if (paper) {
    return {
      id: citationId,
      verified: true,
      confidence: 'high',
      source: paper.source,
      paper
    };
  } else {
    return {
      id: citationId,
      verified: false,
      message: 'DOI could not be located in CrossRef or PubMed'
    };
  }
}

async function run() {
  console.log(`Starting throttled CrossRef/PubMed verification for ${citations.length} citations...`);
  const results = await Promise.all(citations.map((c, i) => verifySingle(c, i)));
  
  const verified = results.filter(r => r.verified).length;
  const failed = results.filter(r => !r.verified).length;
  
  const report = {
    summary: { total: citations.length, verified, failed },
    results
  };
  
  fs.writeFileSync('verification_report.json', JSON.stringify(report, null, 2));
  console.log("\nVerification finished. Report saved to verification_report.json");
  console.log(`Summary: Verified: ${verified}, Failed: ${failed}`);
  
  if (failed > 0) {
    console.log("\nFailed to verify references:");
    results.filter(r => !r.verified).forEach(f => {
      console.log(`- ID: ${f.id}, Message: ${f.message}`);
    });
  } else {
    console.log("\nAll references successfully verified!");
  }
}

run().catch(console.error);
