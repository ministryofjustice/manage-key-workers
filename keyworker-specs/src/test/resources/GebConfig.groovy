import org.openqa.selenium.chrome.ChromeDriver

waiting {
    timeout = 2
}

driver = {

    def driverInstance = chromeDriver()

    driverInstance.manage().window().maximize()
    driverInstance
}

private ChromeDriver chromeDriver() {
    System.setProperty('webdriver.chrome.driver', '/Users/syscon/dev/work/licences/chromedriver')

    new ChromeDriver()
}


baseUrl = "http://localhost:3001/"

reportsDir = "build/geb-reports"
