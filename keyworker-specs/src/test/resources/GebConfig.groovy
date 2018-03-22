import org.openqa.selenium.Dimension
import org.openqa.selenium.chrome.ChromeDriver

waiting {
    timeout = 2
}

driver = {

    System.setProperty('webdriver.chrome.driver', '/Users/syscon/dev/work/licences/chromedriver')

    def driverInstance = new ChromeDriver()
    driverInstance.manage().window().size = new Dimension(640, 1134)
    driverInstance
}


baseUrl = "http://localhost:3001/"

reportsDir = "build/geb-reports"
