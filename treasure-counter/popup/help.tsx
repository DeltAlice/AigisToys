import { Heading, UnorderedList, ListItem, Text, Link, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, Box } from '@chakra-ui/react'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import { iconUrl } from './history'

export const Help = () => (<Accordion allowToggle>
    <AccordionItem>
        <h2>
            <AccordionButton>
                <Box as='span' flex='1' textAlign='left'>
                    <Heading as='h3' size='md'>使用帮助</Heading>
                </Box>
                <AccordionIcon />
            </AccordionButton>
        </h2>
        <AccordionPanel pb={4}>
            <UnorderedList>
                <ListItem>
                    <Heading as='h4' size='sm'>
                        掉落物无法正常显示图标
                    </Heading>
                    <Text fontSize='sm'>可能是网络和资源服务器之间的连接有问题，也有可能是资源服务器上没有正确配置。
                        尝试在浏览器中打开<Link href={`${iconUrl}/1.png`} isExternal>
                            这个王子头像<ExternalLinkIcon mx='2px' />
                        </Link>，如果没有连接失败就说明是服务器端缺失这项资源，去S1千年群或NGA敲一下母猪头子</Text>
                </ListItem>
                <ListItem>
                    <Heading as='h4' size='sm'>
                        显示红色错误提醒
                    </Heading>
                    <Text fontSize='sm'>插件出现了问题，请带着错误提示去<Link href='https://github.com/DogReactor/AigisPlugins' isExternal>
                        项目主页<ExternalLinkIcon mx='2px' /> </Link>提一个Issue，或者在母猪群@∑（如果还没被毁酱踢出群）/在NGA千年楼里@Brecruiser
                    </Text>
                </ListItem>
                <ListItem>
                    <Heading as='h4' size='sm'>
                        这个图标不太对
                    </Heading>
                    <Text fontSize='sm'>数据包的规则发生了变化或者内置分析方法对这张图不适用，同上，请提交一个Issue</Text>
                </ListItem>
            </UnorderedList>
        </AccordionPanel>
    </AccordionItem>
</Accordion>)