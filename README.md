# FashionTrend
패션트렌드분석사이트

master branch로 이동 시 demo폴더와 fashion폴더가 있으며, demo폴더은 백엔드(서버), fashion폴더은 프론트입니다.<br><br>
저는 이 프로젝트에서 프론트(일부는 공동작업)와  일부 api 호출서버, 크롤링 서버를 담당하였습니다.<br><br>
밑은 제가 작업한 폴더입니다.<br><br><br>
> Fashion폴더<br><br>
Brand폴더: 해당 폴더에서 brand메뉴를 작업하였습니다.<br>
Bubble폴더: 해당 폴더에서 우측 상단 아이콘을 클릭 시 나오는 말풍선 모양과 그 안의 메뉴를 작업하였습니다.<br>
FavoriteNewsPage: 해당 폴더에서 로그인한 사용자가 즐겨찾기한 뉴스기사를 보여주는 메뉴를 작업하였습니다.(공동 개발)<br>
header: 해당 폴더에서 상단의 헤더를 작업하였습니다.<br>
home: 해당 폴더에서 사이트 처음 접속 시 나오는 메인화면을 작업하였습니다.<br>
LiveRanking: 해당 폴더에서 실시간 랭킹 메뉴를 작업하였습니다.<br>
Login: 해당 폴더에서 로그인 관련 작업을 하였습니다.(공동 개발)<br>
news: 해당 폴더에서 크롤링한 뉴스 데이터를 가시화하는 작업을 하였습니다.<br>
PersonalUserInfo: 로그인 시 해당 사용자의 정보를 보여주는 작업을 하였습니다.<br>
sidebar: 해당 폴더에서 좌측의 메뉴를 작업하였습니다.<br>
TrendAnalysis: 해당 폴더에서 올해의 트렌드 분석 메뉴를 작업하였습니다.<br>
TrendsAndSearchContainer: 해당 폴더에서 Trend 메뉴를 작업하였습니다.<br>
WishlistPage: 해당 폴더에서 내가 찜한 상품을 보여주는 작업을 하였습니다.(공동 개발)<br>
<br><br><br>
> demo폴더<br><br>
AgeShoppingInsightsService.java: 네이버 api를 통해 연령별 데이터를 가져옵니다.<br>
BrandCrawlingController/Service.java: 네이버 쇼핑 사이트에서 인기브랜드를 크롤링하는 서버입니다.<br>
CrawlerController.java: 패션 관련 인기검색어 100개를 크롤링하는 서버입니다.<br>
CrawlingService.java: 패션 뉴스 기사를 크롤링하는 서버입니다.<br>
GenderShoppingInsightsService.java: 네이버 api를 통해 성별 데이터를 가져옵니다.<br>

- 탭과 카테고리를 이용하여, 큰 틀을 잡아 네이버에서 제공하는 자료를 그래프로 보여줍니다.
- 올해의 트렌드를 비교분석하여 두 트렌드의 연관 관계를 한 눈에 보기 편하게 나타냅니다.
- 패션 관련 인기검색어를 2가지 방식으로 보여주어, 각 사용자가 원하는 형태로 보고 이용할 수 있게 하였습니다.
- 인기 패션 브랜드와 해당 상품을 보여주는 기능을 추가하였습니다.
- 패션 관련 뉴스들을 가져와 패션 시장 및 새로 뜨는 소재 등을 기사로 접할 수 있게 하였습니다.
- 해당 사이트에서 볼 수 있는 상품 및 뉴스는 찜 기능을 추가하여, 내가 원하는 상품과 뉴스를 따로 모아서 볼 수 있게 하였습니다.
